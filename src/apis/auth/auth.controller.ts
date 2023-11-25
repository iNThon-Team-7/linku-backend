import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import {
  AuthCertificateRequestDto,
  AuthFcmRequestDto,
  AuthLoginRequestDto,
  AuthRefreshRequestDto,
  AuthRegisterRequestDto,
  AuthTokenResponseDto,
  AuthUserDto,
} from 'src/dtos';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { MailService } from './mail/mail.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUuid } from 'src/lib/utils/uuid.util';
import { FcmService } from '../fcm/fcm.service';
import { AuthUser } from 'src/lib/decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly fcmService: FcmService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: '로그인 및 Refresh Token 저장' })
  async login(
    @Body() payload: AuthLoginRequestDto,
  ): Promise<AuthTokenResponseDto> {
    const { email, password } = payload;

    const user = await this.userService.getUserByEmail(email);
    const isVerified = await this.authService.verifyLogin(user, password);
    if (!isVerified) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    const hashedRefreshToken = await this.authService.hash(refreshToken);
    await this.userService.updateUserRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh Token으로 Access Token 갱신' })
  async refresh(
    @Body() payload: AuthRefreshRequestDto,
  ): Promise<AuthTokenResponseDto> {
    const { refreshToken } = payload;

    const decodedToken = await this.authService.decodeToken(refreshToken);
    if (!decodedToken) {
      throw new BadRequestException('유효하지 않은 정보입니다.');
    }

    const { id } = decodedToken;
    const user = await this.userService.getUserById(id);
    const isVerified = await this.authService.verifyToken(user, refreshToken);
    if (!isVerified) {
      throw new UnauthorizedException('인증되지 않은 정보입니다.');
    }

    const accessToken = this.authService.refreshAccessToken(decodedToken);
    return { accessToken, refreshToken };
  }

  @Post('/register')
  @ApiOperation({ summary: '회원 가입 및 인증 이메일 전송' })
  async register(@Body() body: AuthRegisterRequestDto): Promise<void> {
    const { email, password } = body;
    const hashedPassword = await this.authService.hash(password);

    const isDuplicated = await this.userService.checkDuplicationEmail(email);
    if (!isDuplicated) {
      throw new BadRequestException('이미 서비스에 가입된 이메일입니다.');
    }

    const uuid = randomUuid();
    await this.userService.createUser({
      email,
      uuid,
      password: hashedPassword,
    });

    await this.mailService.sendCertificateMail(email, uuid);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그아웃 및 Refresh Token 삭제' })
  @ApiBearerAuth()
  async logout(@AuthUser() user: AuthUserDto): Promise<void> {
    const { id } = user;
    await this.userService.updateUserRefreshToken(id, null);
  }

  @Get('/certificate')
  @ApiOperation({ summary: '회원 이메일 인증 처리' })
  async certificate(
    @Query() payload: AuthCertificateRequestDto,
  ): Promise<void> {
    const { code } = payload;

    const user = await this.userService.getUserByUuid(code);
    if (!user) {
      throw new BadRequestException('유효하지 않은 정보입니다.');
    }

    const { id, fcmToken } = user;
    await this.userService.certifyUser(id);

    await this.fcmService.sendMessageCertificate(fcmToken);
  }

  @Post('/fcm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원 FCM Token 갱신' })
  @ApiBearerAuth()
  async updateFcmToken(
    @AuthUser() user: AuthUserDto,
    @Body() payload: AuthFcmRequestDto,
  ): Promise<void> {
    const { id } = user;
    const { fcmToken } = payload;

    await this.userService.updateUserFcmToken(id, fcmToken);
  }
}
