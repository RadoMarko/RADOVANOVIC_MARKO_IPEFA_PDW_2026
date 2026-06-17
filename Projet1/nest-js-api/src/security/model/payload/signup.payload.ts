import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SignupPayload {
  @ApiProperty({ example: 'nicolas' })
  @IsNotEmpty()
  @Length(1, 10)
  username: string;

  @ApiProperty({ example: 'P@ssword' })
  @IsNotEmpty()
  @Length(1, 10)
  password: string;

  @ApiProperty({ example: 'dev@super.be' })
  @IsNotEmpty()
  @IsEmail()
  mail: string;

  @ApiProperty({ required: false, example: '' })
  @IsOptional()
  googleHash: string;

  @ApiProperty({ required: false, example: '' })
  @IsOptional()
  facebookHash: string;
}
