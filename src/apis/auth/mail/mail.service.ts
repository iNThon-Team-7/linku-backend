import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCertificateMail(email: string, uuid: string): Promise<void> {
    return this.mailerService.sendMail({
      to: email,
      subject: '[LinKU] 회원가입 이메일 인증 안내입니다.',
      template: 'certificate',
      context: { email, uuid },
    });
  }
}
