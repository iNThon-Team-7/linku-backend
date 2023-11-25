import { Controller } from '@nestjs/common';
import { FcmService } from '../fcm/fcm.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('meet')
@ApiTags('meet')
export class MeetController {
  constructor(private readonly fcmService: FcmService) {}
}
