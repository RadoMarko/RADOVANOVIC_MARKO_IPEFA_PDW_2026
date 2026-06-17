import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Address } from '../../../common/model';
import { ApiCodeResponse } from '../../../common/api';
import { Gender } from '../enum';
import { MemberSubscription } from '../entity';

export class MemberUpdatePayload {
  @ApiProperty()
  @IsNotEmpty({ message: ApiCodeResponse.MEMBER_PAYLOAD_MEMBER_ID_MANDATORY })
  @Length(26, 26, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_MEMBER_ID_LENGTH_ERROR,
  })
  member_id: string;

  @ApiPropertyOptional()
  @IsString({ message: ApiCodeResponse.MEMBER_PAYLOAD_FIRSTNAME_IS_NOT_STRING })
  @IsOptional()
  @Length(1, 50, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_FIRSTNAME_LENGTH_ERROR,
  })
  firstname: string;

  @ApiPropertyOptional()
  @IsString({ message: ApiCodeResponse.MEMBER_PAYLOAD_LASTNAME_IS_NOT_STRING })
  @IsOptional()
  @Length(1, 50, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_LASTNAME_LENGTH_ERROR,
  })
  lastname: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate({ message: ApiCodeResponse.MEMBER_PAYLOAD_BIRTHDATE_IS_NOT_VALID })
  @IsOptional()
  birthdate: Date;

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_GENDER_IS_NOT_VALID,
  })
  @IsOptional()
  gender: Gender;

  @ApiPropertyOptional()
  @IsEmail(undefined, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_MAIL_IS_NOT_VALID,
  })
  @IsOptional()
  @Length(1, 50, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_MAIL_LENGTH_ERROR,
  })
  mail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 50, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_PHONE_LENGTH_ERROR,
  })
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 34, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_IBAN_LENGTH_ERROR,
  })
  iban: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 10, {
    message: ApiCodeResponse.MEMBER_PAYLOAD_ACTIVATION_CODE_LENGTH_ERROR,
  })
  code_activation: string;

  @ApiPropertyOptional({ type: Array })
  @IsOptional()
  @IsArray({ message: ApiCodeResponse.MEMBER_PAYLOAD_SUBSCRIPTION_NOT_VALID })
  subscriptions: MemberSubscription[];

  @ApiPropertyOptional({ type: Address })
  @IsOptional()
  address: Address;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: ApiCodeResponse.MEMBER_PAYLOAD_ACTIVE_INVALID })
  active: boolean;
}
