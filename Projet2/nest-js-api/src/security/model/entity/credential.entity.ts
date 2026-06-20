import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Exclude } from 'class-transformer';

@Entity()
export class Credential {
  @PrimaryColumn('varchar', { length: 26 })
  credential_id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false, unique: true })
  mail: string;

  @Column({ nullable: true, unique: false })
  facebookHash: string;

  @Column({ nullable: true, unique: false })
  googleHash: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @BeforeInsert()
  generateId() {
    this.credential_id = this.credential_id ?? ulid();
  }
}
