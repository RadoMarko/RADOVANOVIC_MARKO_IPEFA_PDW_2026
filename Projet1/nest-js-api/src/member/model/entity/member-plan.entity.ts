import { BaseEntity } from '../../../common/model';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import {
  MemberPlanFreqTrainingType,
  MemberPlanPaymentType,
  MemberPlanType,
} from '../enum';

@Entity()
export class MemberPlan extends BaseEntity {
  @PrimaryColumn('varchar', { length: 26 })
  member_plan_id: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    default: MemberPlanType.SUBSCRIPTION,
  })
  type: MemberPlanType;

  @Column({ length: 80, nullable: false })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 40, nullable: true })
  picture: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  nb_month: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: MemberPlanPaymentType.MENSUAL,
  })
  payment: MemberPlanPaymentType;

  @Column({ default: true })
  cumulative: boolean;

  @Column({ default: 7 })
  nb_training: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: MemberPlanFreqTrainingType.PER_WEEK,
  })
  freq_training: MemberPlanFreqTrainingType;

  @BeforeInsert()
  setId() {
    this.member_plan_id = this.member_plan_id ?? ulid();
  }
}
