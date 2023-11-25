import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meet } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(Meet)
    private readonly meetRepository: Repository<Meet>,
  ) {}
}
