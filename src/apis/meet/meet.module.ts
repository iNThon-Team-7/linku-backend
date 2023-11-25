import { Module } from '@nestjs/common';
import { FcmModule } from '../fcm/fcm.module';
import { MeetController } from './meet.controller';

@Module({
  imports: [FcmModule],
  controllers: [MeetController],
  providers: [],
})
export class MeetModule {}
