import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { StudyStatus } from '../enum';

export class StudyUpdatePayload {
  @ApiProperty({ example: '01JY0000000000000000000000' })
  @IsNotEmpty()
  @Length(26, 26)
  study_id: string;

  @ApiProperty({ required: false, example: 'Clinical Study Manager' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    required: false,
    example: 'Étude clinique de démonstration pour le projet web.',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: false, example: '2026-01-01T12:00:00' })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false, example: '2026-01-31T12:00:00' })
  @IsOptional()
  endDate: Date;

  @ApiProperty({
    required: false,
    enum: StudyStatus,
    example: StudyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StudyStatus)
  status: StudyStatus;
}
