import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiCodeResponse } from '../../../common/api';
import {
  MemberPlanFreqTrainingType,
  MemberPlanPaymentType,
  MemberPlanType,
} from '../enum';

export class MemberPlanCreatePayload {
  @ApiPropertyOptional({ enum: MemberPlanType })
  @IsOptional()
  @IsEnum(MemberPlanType, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_TYPE_IS_NOT_VALID,
  })
  type: MemberPlanType;

  @ApiProperty()
  @IsNotEmpty({ message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_TITLE_MANDATORY })
  @Length(1, 80, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_TITLE_LENGTH_ERROR,
  })
  title: string;

  @ApiPropertyOptional()
  @IsString({
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_DESCRIPTION_IS_NOT_STRING,
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 40, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PICTURE_LENGTH_ERROR,
  })
  picture: string;

  @ApiProperty()
  @IsNumber(undefined, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PRICE_IS_NOT_NUMBER,
  })
  @IsNotEmpty({ message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PRICE_MANDATORY })
  price: number;

  @ApiProperty()
  @IsNumber(undefined, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_NB_MONTH_IS_NOT_NUMBER,
  })
  @IsNotEmpty({
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_NB_MONTH_MANDATORY,
  })
  nb_month: number;

  @ApiPropertyOptional({ enum: MemberPlanPaymentType })
  @IsOptional()
  @IsEnum(MemberPlanPaymentType, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PAYMENT_IS_NOT_VALID,
  })
  payment: MemberPlanPaymentType;

  @ApiPropertyOptional({ default: true })
  @IsBoolean({
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_CUMULATIVE_INVALID,
  })
  @IsOptional()
  cumulative: boolean;

  @ApiPropertyOptional({ default: 7 })
  @IsNumber(undefined, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_NB_TRAINING_IS_NOT_NUMBER,
  })
  @IsOptional()
  nb_training: number;

  @ApiPropertyOptional({ enum: MemberPlanFreqTrainingType })
  @IsOptional()
  @IsEnum(MemberPlanFreqTrainingType, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_FREQ_TRAINING_IS_NOT_VALID,
  })
  freq_training: MemberPlanFreqTrainingType;
}
