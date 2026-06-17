import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.configuration';

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
    const password = 'P@ss';
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

  it('/member business module flow', async () => {
    const token = await getAccessToken();

    const member = await request(app.getHttpServer())
      .post('/api/member/create')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(201);

    expect(member.body.result).toBe(true);
    expect(member.body.data.member_id).toHaveLength(26);
    expect(member.body.data.code_activation).toHaveLength(10);

    const plan = await request(app.getHttpServer())
      .post('/api/member-plan/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Abonnement annuel',
        price: 800,
        nb_month: 12,
      })
      .expect(201);

    expect(plan.body.result).toBe(true);
    expect(plan.body.data.member_plan_id).toHaveLength(26);

    const updated = await request(app.getHttpServer())
      .put('/api/member/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        member_id: member.body.data.member_id,
        firstname: 'Nicolas',
        lastname: 'Ledent',
        subscriptions: [
          {
            active: true,
            member_plan: {
              member_plan_id: plan.body.data.member_plan_id,
            },
          },
        ],
      })
      .expect(200);

    expect(updated.body.result).toBe(true);
    expect(updated.body.data.subscriptions).toHaveLength(1);
    expect(
      updated.body.data.subscriptions[0].member_subscription_id,
    ).toHaveLength(26);
    expect(updated.body.data.subscriptions[0].member_plan.title).toBe(
      'Abonnement annuel',
    );

    await request(app.getHttpServer())
      .get(`/api/member/detail/${member.body.data.member_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.result).toBe(true);
        expect(body.data.firstname).toBe('Nicolas');
        expect(body.data.subscriptions).toHaveLength(1);
      });
  });

  const getAccessToken = async (): Promise<string> => {
    const suffix = Date.now().toString().slice(-8);
    const username = `m${suffix}`;
    const password = 'P@ss';

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
