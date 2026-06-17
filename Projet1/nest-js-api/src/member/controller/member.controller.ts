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
import { MemberService } from '../service';
import { Member, MemberCreatePayload, MemberUpdatePayload } from '../model';
import {
  MemberControllerCreate,
  MemberControllerDelete,
  MemberControllerDetail,
  MemberControllerList,
  MemberControllerUpdate,
} from '../member.swagger';

@ApiBearerAuth('access-token')
@ApiTags('Membre')
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @ApiOperation(MemberControllerCreate)
  @ApiOkResponse({ description: 'Membre cree.' })
  @Post('create')
  create(@Body() payload: MemberCreatePayload): Promise<Member> {
    return this.service.create(payload);
  }

  @ApiOperation(MemberControllerDelete)
  @ApiOkResponse({ description: 'Membre supprime.' })
  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  @ApiOperation(MemberControllerDetail)
  @ApiOkResponse({ description: 'Detail du membre.' })
  @Get('detail/:id')
  detail(@Param('id') id: string): Promise<Member> {
    return this.service.detail(id);
  }

  @ApiOperation(MemberControllerList)
  @ApiOkResponse({ description: 'Liste des membres.' })
  @Get('list')
  getAll(): Promise<Member[]> {
    return this.service.getAll();
  }

  @ApiOperation(MemberControllerUpdate)
  @ApiOkResponse({ description: 'Membre modifie.' })
  @Put('update')
  update(@Body() payload: MemberUpdatePayload): Promise<Member> {
    return this.service.update(payload);
  }
}
