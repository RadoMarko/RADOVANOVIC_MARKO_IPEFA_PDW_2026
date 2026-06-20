import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/config';
import { AppControllerHelloWorld } from './app.swagger';

@ApiTags('Route de base')
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOperation(AppControllerHelloWorld)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
