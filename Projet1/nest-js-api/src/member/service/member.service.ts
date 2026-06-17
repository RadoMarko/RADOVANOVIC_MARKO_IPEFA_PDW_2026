import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { isNil } from 'lodash';
import { Repository } from 'typeorm';
import {
  Member,
  MemberCreatePayload,
  MemberSubscription,
  MemberUpdatePayload,
} from '../model';
import {
  MemberCreateException,
  MemberDeleteException,
  MemberListException,
  MemberNotFoundException,
  MemberUpdateException,
} from '../member.exception';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);

  constructor(
    @InjectRepository(Member) private readonly repository: Repository<Member>,
  ) {}

  async create(payload: MemberCreatePayload): Promise<Member> {
    try {
      const newMember = this.repository.create(
        Builder<Member>()
          .firstname(payload.firstname)
          .lastname(payload.lastname)
          .mail(payload.mail)
          .iban(payload.iban)
          .phone(payload.phone)
          .gender(payload.gender)
          .birthdate(payload.birthdate)
          .address(payload.address)
          .active(payload.active)
          .code_activation(payload.code_activation)
          .subscriptions(this.createSubscriptions(payload.subscriptions) ?? [])
          .build(),
      );

      return await this.repository.save(newMember);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberCreateException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const detail = await this.detail(id);
      await this.repository.remove(detail);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberDeleteException();
    }
  }

  async detail(id: string): Promise<Member> {
    const result = await this.repository.findOneBy({ member_id: id });

    if (!isNil(result)) {
      return result;
    }

    throw new MemberNotFoundException();
  }

  async getAll(): Promise<Member[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberListException();
    }
  }

  async update(payload: MemberUpdatePayload): Promise<Member> {
    try {
      const detail = await this.detail(payload.member_id);
      detail.firstname = payload.firstname ?? detail.firstname;
      detail.lastname = payload.lastname ?? detail.lastname;
      detail.birthdate = payload.birthdate ?? detail.birthdate;
      detail.gender = payload.gender ?? detail.gender;
      detail.mail = payload.mail ?? detail.mail;
      detail.phone = payload.phone ?? detail.phone;
      detail.iban = payload.iban ?? detail.iban;
      detail.address = payload.address ?? detail.address;
      detail.active = payload.active ?? detail.active;
      detail.subscriptions =
        this.createSubscriptions(payload.subscriptions) ?? detail.subscriptions;

      await this.repository.save(detail);
      return this.detail(detail.member_id);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberUpdateException();
    }
  }

  private createSubscriptions(
    subscriptions?: MemberSubscription[],
  ): MemberSubscription[] | undefined {
    return subscriptions?.map((subscription) =>
      Object.assign(new MemberSubscription(), subscription),
    );
  }
}
