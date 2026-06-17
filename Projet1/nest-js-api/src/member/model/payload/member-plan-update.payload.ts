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

export class MemberPlanUpdatePayload {
  @ApiProperty()
  @IsNotEmpty({
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_MEMBER_PLAN_ID_MANDATORY,
  })
  @Length(26, 26, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_MEMBER_PLAN_ID_LENGTH_ERROR,
  })
  member_plan_id: string;

  @ApiPropertyOptional({ enum: MemberPlanType })
  @IsOptional()
  @IsEnum(MemberPlanType, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_TYPE_IS_NOT_VALID,
  })
  type: MemberPlanType;

  @ApiPropertyOptional()
  @IsOptional()
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

  @ApiPropertyOptional()
  @IsNumber(undefined, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PRICE_IS_NOT_NUMBER,
  })
  @IsOptional()
  price: number;

  @ApiPropertyOptional()
  @IsNumber(undefined, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_NB_MONTH_IS_NOT_NUMBER,
  })
  @IsOptional()
  nb_month: number;

  @ApiPropertyOptional({ enum: MemberPlanPaymentType })
  @IsOptional()
  @IsEnum(MemberPlanPaymentType, {
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_PAYMENT_IS_NOT_VALID,
  })
  payment: MemberPlanPaymentType;

  @ApiPropertyOptional()
  @IsBoolean({
    message: ApiCodeResponse.MEMBER_PLAN_PAYLOAD_CUMULATIVE_INVALID,
  })
  @IsOptional()
  cumulative: boolean;

  @ApiPropertyOptional()
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
