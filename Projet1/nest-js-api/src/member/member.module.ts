import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../common/model';
import { Member, MemberPlan, MemberSubscription } from './model';
import { MemberController, MemberPlanController } from './controller';
import { MemberPlanService, MemberService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberPlan, MemberSubscription, Address]),
  ],
  controllers: [MemberController, MemberPlanController],
  providers: [MemberPlanService, MemberService],
})
export class MemberModule {}
