import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { TokenPayloadDto } from 'src/dtos';
import { User } from 'src/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private hashIfLong(target: string): string {
    return target.length > 72
      ? createHash('sha256').update(target).digest('hex')
      : target;
  }

  async hash(target: string): Promise<string> {
    return bcrypt.hash(this.hashIfLong(target), 10);
  }

  async verifyHash(target: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(this.hashIfLong(target), hashed);
  }

  async verifyLogin(user: User, password: string): Promise<boolean> {
    if (!user) return false;
    const { certified, password: hashedPassword } = user;

    return certified && this.verifyHash(password, hashedPassword);
  }

  async decodeToken(token: string): Promise<TokenPayloadDto | undefined> {
    return this.jwtService
      .verifyAsync(token)
      .then((decoded) =>
        decoded && decoded.id && decoded.email
          ? { id: decoded.id, email: decoded.email }
          : undefined,
      )
      .catch(() => undefined);
  }

  async verifyToken(user: User, refreshToken: string): Promise<boolean> {
    if (!user) return false;

    const { refreshToken: hashedRefreshToken } = user;
    if (!hashedRefreshToken) return false;

    return this.verifyHash(refreshToken, hashedRefreshToken);
  }

  private signToken(payload: TokenPayloadDto, isRefresh?: boolean): string {
    const options: JwtSignOptions = isRefresh
      ? { expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') }
      : {};

    return this.jwtService.sign(payload, options);
  }

  generateAccessToken(user: User): string {
    const { id, email } = user;
    const payload: TokenPayloadDto = { id, email };
    return this.signToken(payload);
  }

  generateRefreshToken(user: User): string {
    const { id, email } = user;
    const payload: TokenPayloadDto = { id, email };
    return this.signToken(payload, true);
  }

  refreshAccessToken(payload: TokenPayloadDto): string {
    return this.signToken(payload);
  }
}
