import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { FcmMessageDto, FcmResultDto } from 'src/dtos';

@Injectable()
export class FcmService {
  constructor(private readonly httpService: HttpService) {}

  private async sendFcm(info: {
    token: string;
    title: string;
    body: string;
    type: string;
    data: { [key: string]: string | number };
  }): Promise<FcmResultDto> {
    const { token, title, body, type, data } = info;

    if (!token) {
      console.log('FCM send error: token is empty');
      return;
    }

    const message: FcmMessageDto = {
      to: token,
      content_available: true,
      notification: {
        title,
        body,
        priority: 'high',
        android_channel_id: 'linku-android-channel',
      },
      data: {
        type,
        ...data,
      },
    };

    const result = await firstValueFrom(
      this.httpService
        .post<FcmResultDto>('https://fcm.googleapis.com/fcm/send', message)
        .pipe(map((x) => x.data)),
    );

    if (result?.failure > 0) {
      console.log('FCM send error:', message, result);
    }

    return result;
  }

  async sendMessageNewMeet(
    token: string,
    meetId: number,
  ): Promise<FcmResultDto> {
    return this.sendFcm({
      token,
      title: '관심 분야에 새로운 모임이 생성되었습니다.',
      body: '지금 LinKU에서 새로운 모임을 확인해 보세요!',
      type: 'newMeet',
      data: {
        meetId,
      },
    });
  }

  async sendMessageNewReply(
    token: string,
    meetId: number,
  ): Promise<FcmResultDto> {
    return this.sendFcm({
      token,
      title: '참여한 모임에 새로운 댓글이 달렸습니다.',
      body: '지금 LinKU에서 새로운 댓글을 확인해 보세요!',
      type: 'newReply',
      data: {
        meetId,
      },
    });
  }

  async sendMessageOnMeet(
    token: string,
    meetId: number,
  ): Promise<FcmResultDto> {
    return this.sendFcm({
      token,
      title: '참여한 모임의 시작 시간이 되었습니다.',
      body: '지금 LinKU에 접속해 모임에 참여해 보세요!',
      type: 'newReply',
      data: {
        meetId,
      },
    });
  }

  async sendMessageCertificate(token: string): Promise<FcmResultDto> {
    return this.sendFcm({
      token,
      title: '이메일 인증이 완료되었습니다.',
      body: '지금 LinKU에 접속해 모임에 참여해 보세요!',
      type: 'certificate',
      data: {},
    });
  }
}
