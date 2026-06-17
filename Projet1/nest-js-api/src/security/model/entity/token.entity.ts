import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Credential } from './credential.entity';

@Entity()
export class Token {
  @PrimaryColumn('varchar', { length: 26 })
  token_id: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  refreshToken: string;

  @OneToOne(() => Credential, { eager: true })
  @JoinColumn({ name: 'credential_id' })
  credential: Credential;

  @BeforeInsert()
  generateId() {
    this.token_id = this.token_id ?? ulid();
  }
}
