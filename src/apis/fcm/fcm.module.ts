import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FcmService } from './fcm.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        headers: {
          Authorization: `key=${config.get<string>('FCM_ACCESS_KEY')}`,
        },
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
