import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configuration';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          code: 'COMMON_SUCCESS',
          data: 'Hello World!',
          result: true,
        });
      });
  });

  it('/account auth flow', async () => {
    const suffix = Date.now().toString().slice(-8);
    const username = `u${suffix}`;
    const password = 'P@ssword1';
    const mail = `${username}@test.be`;

    const signup = await request(app.getHttpServer())
      .post('/api/account/signup')
      .send({
        username,
        password,
        mail,
        googleHash: '',
        facebookHash: '',
      })
      .expect(201);

    expect(signup.body.result).toBe(true);
    expect(signup.body.data.token).toBeDefined();
    expect(signup.body.data.refreshToken).toBeDefined();
    expect(signup.body.data.credential.password).toBeUndefined();

    const signin = await request(app.getHttpServer())
      .post('/api/account/signin')
      .send({
        username,
        password,
        googleHash: '',
        facebookHash: '',
        socialLogin: false,
      })
      .expect(201);

    const token = signin.body.data.token as string;
    const refreshToken = signin.body.data.refreshToken as string;

    await request(app.getHttpServer())
      .get('/api/account/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.data.username).toBe(username);
        expect(body.data.password).toBeUndefined();
      });

    await request(app.getHttpServer())
      .post('/api/account/refresh')
      .send({ refresh: refreshToken })
      .expect(201)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.data.token).toBeDefined();
        expect(body.data.refreshToken).toBeDefined();
      });
  });

  it('/study business module flow', async () => {
    const token = await getAccessToken();
    const suffix = Date.now().toString().slice(-8);
    const studyName = `Clinical Study Manager ${suffix}`;
    const updatedStudyName = `Clinical Study Manager Updated ${suffix}`;

    const created = await request(app.getHttpServer())
      .post('/api/study/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: studyName,
        description: 'Étude clinique de démonstration.',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        status: 'DRAFT',
      })
      .expect(201);

    expect(created.body.result).toBe(true);
    expect(created.body.code).toBe('STUDY_CREATE_SUCCESS');
    expect(created.body.data.study_id).toHaveLength(26);
    expect(created.body.data.code).toHaveLength(4);

    await request(app.getHttpServer())
      .get('/api/study/list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.code).toBe('STUDY_LIST_SUCCESS');
        expect(body.data.length).toBeGreaterThan(0);
      });

    const updated = await request(app.getHttpServer())
      .put('/api/study/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        study_id: created.body.data.study_id,
        name: updatedStudyName,
        status: 'ACTIVE',
      })
      .expect(200);

    expect(updated.body.result).toBe(true);
    expect(updated.body.code).toBe('STUDY_UPDATE_SUCCESS');
    expect(updated.body.data.name).toBe(updatedStudyName);
    expect(updated.body.data.status).toBe('ACTIVE');

    await request(app.getHttpServer())
      .get(`/api/study/detail/${created.body.data.study_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.code).toBe('STUDY_DETAIL_SUCCESS');
        expect(body.data.code).toBe(created.body.data.code);
      });

    await request(app.getHttpServer())
      .post('/api/study/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: updatedStudyName,
        description: 'Doublon.',
        status: 'DRAFT',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(false);
        expect(body.code).toBe('STUDY_NAME_ALREADY_EXISTS');
      });

    await request(app.getHttpServer())
      .delete(`/api/study/delete/${created.body.data.study_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.code).toBe('STUDY_DELETE_SUCCESS');
      });
  });

  const getAccessToken = async (): Promise<string> => {
    const suffix = Date.now().toString().slice(-8);
    const username = `m${suffix}`;
    const password = 'P@ssword1';

    const signup = await request(app.getHttpServer())
      .post('/api/account/signup')
      .send({
        username,
        password,
        mail: `${username}@test.be`,
        googleHash: '',
        facebookHash: '',
      })
      .expect(201);

    return signup.body.data.token as string;
  };

  afterEach(async () => {
    await app.close();
  });
});
