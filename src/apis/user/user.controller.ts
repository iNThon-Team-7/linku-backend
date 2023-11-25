import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/lib/decorators/auth.user.decorator';
import { AuthUserDto, UserResponseDto } from 'src/dtos';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  @ApiBearerAuth()
  async getAuthUser(@AuthUser() user: AuthUserDto): Promise<UserResponseDto> {
    const { id } = user;

    const result = await this.userService.getUserById(id);
    return UserResponseDto.of(result);
  }
}
