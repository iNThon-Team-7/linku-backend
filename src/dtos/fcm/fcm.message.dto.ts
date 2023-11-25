import { FcmDataDto } from './fcm.data.dto';

class FcmMessageDto {
  to: string;
  content_available: boolean;
  notification: {
    title: string;
    body: string;
    priority: string;
    android_channel_id: string;
  };
  data: FcmDataDto;
}

export { FcmMessageDto };
