import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUserDto,
  UserDetailResponseDto,
  UserProfileRequestDto,
  UserRequestDto,
  UserResponseDto,
} from 'src/dtos';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { ImageType, Role, parseImageType } from 'src/lib/enums';
import { AuthUser, InterceptFile } from 'src/lib/decorators';
import { Response } from 'express';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  @ApiBearerAuth()
  async getAuthUser(
    @AuthUser() user: AuthUserDto,
  ): Promise<UserDetailResponseDto> {
    const { id } = user;

    const result = await this.userService.getUserWithTagsById(id);
    return UserDetailResponseDto.of(result);
  }

  @Get('/:id')
  @ApiOperation({ summary: '특정 사용자 정보 조회' })
  async getUser(@Param() params: UserRequestDto): Promise<UserResponseDto> {
    const { id } = params;

    const result = await this.userService.getUserByIdOrFail(id);
    return UserResponseDto.of(result);
  }

  @Get('/:id/image')
  @Header('Content-Type', 'image/jpeg')
  @Header('Cache-Control', 'no-cache')
  @ApiOperation({ summary: '사용자 프로필 이미지 조회' })
  async getUserImage(
    @Param() params: UserRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    const { id } = params;

    const { image } = await this.userService.getUserByIdOrFail(id);
    if (!image) {
      throw new BadRequestException('프로필 이미지가 존재하지 않습니다.');
    }

    response.send(image);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '사용자 프로필 정보 변경' })
  @ApiBearerAuth()
  async updateProfile(
    @AuthUser() user: AuthUserDto,
    @Body() body: UserProfileRequestDto,
  ): Promise<void> {
    const { id } = user;

    return this.userService.updateUserProfile(id, { ...body });
  }

  @Patch('image')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @InterceptFile('image')
  @ApiOperation({ summary: '사용자 프로필 이미지 변경' })
  @ApiBearerAuth()
  async uploadImage(
    @AuthUser() user: AuthUserDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    const { id } = user;

    if (!image) {
      throw new BadRequestException('이미지 파일을 선택해주세요.');
    }
    const { mimetype, buffer } = image;

    const type: ImageType = parseImageType(mimetype);
    if (!type) {
      throw new BadRequestException('지원하지 않는 이미지 타입입니다.');
    }

    await this.userService.updateUserImage(id, buffer);
  }
}
