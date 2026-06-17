import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { isNil } from 'lodash';
import { Repository } from 'typeorm';
import {
  MemberPlan,
  MemberPlanCreatePayload,
  MemberPlanUpdatePayload,
} from '../model';
import {
  MemberPlanCreateException,
  MemberPlanDeleteException,
  MemberPlanListException,
  MemberPlanNotFoundException,
  MemberPlanUpdateException,
} from '../member.exception';

@Injectable()
export class MemberPlanService {
  private readonly logger = new Logger(MemberPlanService.name);

  constructor(
    @InjectRepository(MemberPlan)
    private readonly repository: Repository<MemberPlan>,
  ) {}

  async create(payload: MemberPlanCreatePayload): Promise<MemberPlan> {
    try {
      return await this.repository.save(
        this.repository.create(
          Builder<MemberPlan>()
            .type(payload.type)
            .title(payload.title)
            .description(payload.description)
            .picture(payload.picture)
            .price(payload.price)
            .nb_month(payload.nb_month)
            .payment(payload.payment)
            .cumulative(payload.cumulative)
            .nb_training(payload.nb_training)
            .freq_training(payload.freq_training)
            .build(),
        ),
      );
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberPlanCreateException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const detail = await this.detail(id);
      await this.repository.remove(detail);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberPlanDeleteException();
    }
  }

  async detail(id: string): Promise<MemberPlan> {
    const result = await this.repository.findOneBy({ member_plan_id: id });

    if (!isNil(result)) {
      return result;
    }

    throw new MemberPlanNotFoundException();
  }

  async getAll(): Promise<MemberPlan[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberPlanListException();
    }
  }

  async update(payload: MemberPlanUpdatePayload): Promise<MemberPlan> {
    try {
      const detail = await this.detail(payload.member_plan_id);
      detail.type = payload.type ?? detail.type;
      detail.title = payload.title ?? detail.title;
      detail.description = payload.description ?? detail.description;
      detail.picture = payload.picture ?? detail.picture;
      detail.price = payload.price ?? detail.price;
      detail.nb_month = payload.nb_month ?? detail.nb_month;
      detail.payment = payload.payment ?? detail.payment;
      detail.cumulative = payload.cumulative ?? detail.cumulative;
      detail.freq_training = payload.freq_training ?? detail.freq_training;
      detail.nb_training = payload.nb_training ?? detail.nb_training;

      return await this.repository.save(detail);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new MemberPlanUpdateException();
    }
  }
}
