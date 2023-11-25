import { Module } from '@nestjs/common';
import { Subscription, Tag, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Subscription, User])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
