import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { StudyStatus } from '../enum';

export class StudyCreatePayload {
  @ApiProperty({ example: 'Clinical Study Manager' })
  @IsNotEmpty()
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

  @ApiProperty({ enum: StudyStatus, example: StudyStatus.DRAFT })
  @IsOptional()
  @IsEnum(StudyStatus)
  status: StudyStatus;
}
