import { Controller } from '@nestjs/common';
import { FcmService } from '../fcm/fcm.service';
import { ApiTags } from '@nestjs/swagger';
import { MeetService } from './meet.service';

@Controller('meet')
@ApiTags('meet')
export class MeetController {
  constructor(
    private readonly meetService: MeetService,
    private readonly fcmService: FcmService,
  ) {}
}
