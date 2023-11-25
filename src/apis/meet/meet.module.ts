import { Module } from '@nestjs/common';
import { FcmModule } from '../fcm/fcm.module';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meet, Comment, User } from 'src/entities';

@Module({
  imports: [FcmModule, TypeOrmModule.forFeature([Meet, Comment, User])],
  controllers: [MeetController],
  providers: [MeetService],
})
export class MeetModule {}
