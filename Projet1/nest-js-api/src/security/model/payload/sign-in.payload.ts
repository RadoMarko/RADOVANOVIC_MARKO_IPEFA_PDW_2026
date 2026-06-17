import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SignInPayload {
  @ApiProperty({ example: 'nicolas' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'P@ssword' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false, example: '' })
  @IsOptional()
  googleHash: string;

  @ApiProperty({ required: false, example: '' })
  @IsOptional()
  facebookHash: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  socialLogin: boolean = false;
}
