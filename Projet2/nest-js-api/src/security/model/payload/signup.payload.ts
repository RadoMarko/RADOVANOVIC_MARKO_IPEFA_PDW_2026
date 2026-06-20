import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class SignupPayload {
  @ApiProperty({ example: 'nicolas' })
  @IsNotEmpty()
  @Length(1, 10)
  username: string;

  @ApiProperty({
    example: 'P@ssword1',
    description:
      'Mot de passe de 8 à 50 caractères avec au moins une majuscule, un chiffre et un caractère spécial.',
  })
  @IsNotEmpty()
  @Length(8, 50)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
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
