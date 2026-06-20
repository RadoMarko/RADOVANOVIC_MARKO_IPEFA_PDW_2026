import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class ChangePasswordPayload {
  @ApiProperty({ example: 'P@ssword1' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'NewP@ssword1',
    description:
      'Mot de passe de 8 à 50 caractères avec au moins une majuscule, un chiffre et un caractère spécial.',
  })
  @IsNotEmpty()
  @Length(8, 50)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
  newPassword: string;
}
