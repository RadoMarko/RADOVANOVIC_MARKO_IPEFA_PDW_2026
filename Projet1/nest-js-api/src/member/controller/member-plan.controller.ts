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
import { MemberPlanService } from '../service';
import {
  MemberPlan,
  MemberPlanCreatePayload,
  MemberPlanUpdatePayload,
} from '../model';
import {
  MemberPlanControllerCreate,
  MemberPlanControllerDelete,
  MemberPlanControllerDetail,
  MemberPlanControllerList,
  MemberPlanControllerUpdate,
} from '../member.swagger';

@ApiBearerAuth('access-token')
@ApiTags('Abonnement membre')
@Controller('member-plan')
export class MemberPlanController {
  constructor(private readonly service: MemberPlanService) {}

  @ApiOperation(MemberPlanControllerCreate)
  @ApiOkResponse({ description: 'Plan abonnement cree.' })
  @Post('create')
  create(@Body() payload: MemberPlanCreatePayload): Promise<MemberPlan> {
    return this.service.create(payload);
  }

  @ApiOperation(MemberPlanControllerDelete)
  @ApiOkResponse({ description: 'Plan abonnement supprime.' })
  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  @ApiOperation(MemberPlanControllerDetail)
  @ApiOkResponse({ description: 'Detail du plan abonnement.' })
  @Get('detail/:id')
  detail(@Param('id') id: string): Promise<MemberPlan> {
    return this.service.detail(id);
  }

  @ApiOperation(MemberPlanControllerList)
  @ApiOkResponse({ description: 'Liste des plans abonnement.' })
  @Get('list')
  getAll(): Promise<MemberPlan[]> {
    return this.service.getAll();
  }

  @ApiOperation(MemberPlanControllerUpdate)
  @ApiOkResponse({ description: 'Plan abonnement modifie.' })
  @Put('update')
  update(@Body() payload: MemberPlanUpdatePayload): Promise<MemberPlan> {
    return this.service.update(payload);
  }
}
