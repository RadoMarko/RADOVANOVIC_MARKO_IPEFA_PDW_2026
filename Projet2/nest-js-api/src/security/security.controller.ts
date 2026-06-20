import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public, User } from '../common/config';
import {
  ChangePasswordPayload,
  Credential,
  RefreshTokenPayload,
  SignInPayload,
  SignupPayload,
} from './model';
import { SecurityService } from './security.service';
import {
  SecurityControllerAdminSignIn,
  SecurityControllerChangePassword,
  SecurityControllerDelete,
  SecurityControllerMe,
  SecurityControllerRefresh,
  SecurityControllerSignIn,
  SecurityControllerSignUp,
} from './security.swagger';

@ApiBearerAuth('access-token')
@ApiTags('Compte utilisateur')
@Controller('account')
export class SecurityController {
  constructor(private readonly service: SecurityService) {}

  @Public()
  @ApiOperation(SecurityControllerSignIn)
  @ApiOkResponse({ description: 'Connexion utilisateur réussie.' })
  @Post('signin')
  public signIn(@Body() payload: SignInPayload) {
    return this.service.signIn(payload, false);
  }

  @Public()
  @ApiOperation(SecurityControllerAdminSignIn)
  @ApiOkResponse({ description: 'Connexion administrateur réussie.' })
  @Post('admin-signin')
  public adminSignIn(@Body() payload: SignInPayload) {
    return this.service.signIn(payload, true);
  }

  @Public()
  @ApiOperation(SecurityControllerSignUp)
  @ApiOkResponse({ description: 'Compte créé et session ouverte.' })
  @Post('signup')
  public signUp(@Body() payload: SignupPayload) {
    return this.service.signup(payload);
  }

  @Public()
  @ApiOperation(SecurityControllerRefresh)
  @ApiOkResponse({ description: 'Nouveaux tokens générés.' })
  @Post('refresh')
  public refresh(@Body() payload: RefreshTokenPayload) {
    return this.service.refresh(payload);
  }

  @ApiOperation(SecurityControllerMe)
  @ApiOkResponse({ description: "Informations de l'utilisateur connecté." })
  @Get('me')
  public me(@User() user: Credential) {
    return user;
  }

  @ApiOperation(SecurityControllerChangePassword)
  @ApiOkResponse({ description: 'Mot de passe modifié.' })
  @Put('change-password')
  public changePassword(
    @User() user: Credential,
    @Body() payload: ChangePasswordPayload,
  ) {
    return this.service.changePassword(user, payload);
  }

  @ApiOperation(SecurityControllerDelete)
  @ApiOkResponse({ description: 'Compte supprimé.' })
  @Delete('delete/:id')
  public delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
