import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { BaseEntity } from '../../../common/model';
import { StudyStatus } from '../enum';

@Entity()
export class Study extends BaseEntity {
  @PrimaryColumn('varchar', { length: 26 })
  study_id: string;

  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ length: 20, nullable: false, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: StudyStatus.DRAFT,
  })
  status: StudyStatus;

  @BeforeInsert()
  generateId() {
    this.study_id = this.study_id ?? ulid();
  }
}
