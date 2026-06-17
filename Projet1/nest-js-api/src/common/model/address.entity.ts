import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { BaseEntity } from './base.entity';

@Entity()
export class Address extends BaseEntity {
  @PrimaryColumn('varchar', { length: 26 })
  address_id: string;

  @Column({ length: 50, nullable: true, unique: false })
  road: string;

  @Column({ length: 8, nullable: true, unique: false })
  nb: string;

  @Column({ length: 10, nullable: true, unique: false })
  cp: string;

  @Column({ length: 50, nullable: true, unique: false })
  town: string;

  @Column({ length: 50, nullable: true, unique: false })
  country: string;

  @Column({ nullable: true, unique: false })
  complement: string;

  @BeforeInsert()
  setId() {
    this.address_id = this.address_id ?? ulid();
  }
}
