import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public, User } from '../common/config';
import {
  Credential,
  RefreshTokenPayload,
  SignInPayload,
  SignupPayload,
} from './model';
import { SecurityService } from './security.service';
import {
  SecurityControllerAdminSignIn,
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
  @ApiOkResponse({ description: 'Connexion utilisateur reussie.' })
  @Post('signin')
  public signIn(@Body() payload: SignInPayload) {
    return this.service.signIn(payload, false);
  }

  @Public()
  @ApiOperation(SecurityControllerAdminSignIn)
  @ApiOkResponse({ description: 'Connexion administrateur reussie.' })
  @Post('admin-signin')
  public adminSignIn(@Body() payload: SignInPayload) {
    return this.service.signIn(payload, true);
  }

  @Public()
  @ApiOperation(SecurityControllerSignUp)
  @ApiOkResponse({ description: 'Compte cree et session ouverte.' })
  @Post('signup')
  public signUp(@Body() payload: SignupPayload) {
    return this.service.signup(payload);
  }

  @Public()
  @ApiOperation(SecurityControllerRefresh)
  @ApiOkResponse({ description: 'Nouveaux tokens generes.' })
  @Post('refresh')
  public refresh(@Body() payload: RefreshTokenPayload) {
    return this.service.refresh(payload);
  }

  @ApiOperation(SecurityControllerMe)
  @ApiOkResponse({ description: 'Informations de l utilisateur connecte.' })
  @Get('me')
  public me(@User() user: Credential) {
    return user;
  }

  @ApiOperation(SecurityControllerDelete)
  @ApiOkResponse({ description: 'Compte supprime.' })
  @Delete('delete/:id')
  public delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
