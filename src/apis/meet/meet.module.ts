import { Module } from '@nestjs/common';
import { FcmModule } from '../fcm/fcm.module';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meet, Comment, User, Participation } from 'src/entities';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    FcmModule,
    TypeOrmModule.forFeature([Meet, Comment, User, Participation]),
  ],
  controllers: [MeetController],
  providers: [MeetService, UserService],
})
export class MeetModule {}
