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
import { Study, StudyCreatePayload, StudyUpdatePayload } from '../model';
import { StudyService } from '../service';
import {
  StudyControllerCreate,
  StudyControllerDelete,
  StudyControllerDetail,
  StudyControllerList,
  StudyControllerUpdate,
} from '../study.swagger';

@ApiBearerAuth('access-token')
@ApiTags('Études cliniques')
@Controller('study')
export class StudyController {
  constructor(private readonly service: StudyService) {}

  @ApiOperation(StudyControllerCreate)
  @ApiOkResponse({ description: 'Étude clinique créée.' })
  @Post('create')
  create(@Body() payload: StudyCreatePayload): Promise<Study> {
    return this.service.create(payload);
  }

  @ApiOperation(StudyControllerDelete)
  @ApiOkResponse({ description: 'Étude clinique supprimée.' })
  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  @ApiOperation(StudyControllerDetail)
  @ApiOkResponse({ description: "Détail de l'étude clinique." })
  @Get('detail/:id')
  detail(@Param('id') id: string): Promise<Study> {
    return this.service.detail(id);
  }

  @ApiOperation(StudyControllerList)
  @ApiOkResponse({ description: 'Liste des études cliniques.' })
  @Get('list')
  getAll(): Promise<Study[]> {
    return this.service.getAll();
  }

  @ApiOperation(StudyControllerUpdate)
  @ApiOkResponse({ description: 'Étude clinique modifiée.' })
  @Put('update')
  update(@Body() payload: StudyUpdatePayload): Promise<Study> {
    return this.service.update(payload);
  }
}
