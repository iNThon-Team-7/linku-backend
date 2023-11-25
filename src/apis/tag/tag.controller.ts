import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import {
  AuthUserDto,
  TagResponseDto,
  TagSubscriptionRequestDto,
} from 'src/dtos';
import { AuthUser } from 'src/lib/decorators';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from 'src/lib/enums';

@Controller('tag')
@ApiTags('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: '태그 목록 조회' })
  async getTags(): Promise<TagResponseDto[]> {
    const tags = await this.tagService.getTags();
    return tags.map(TagResponseDto.of);
  }

  @Post('/:id/subscription')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '사용자 구독 태그 추가' })
  @ApiBearerAuth()
  async addSubscription(
    @AuthUser() user: AuthUserDto,
    @Param() params: TagSubscriptionRequestDto,
  ): Promise<void> {
    const { id: userId } = user;
    const { id: tagId } = params;

    await this.tagService.getTagByIdOrFail(tagId);

    const subscription = { userId, tagId };
    if (await this.tagService.getSubscription(subscription)) {
      throw new BadRequestException('이미 구독한 태그입니다.');
    }

    return this.tagService.addSubscription(subscription);
  }

  @Delete('/:id/subscription')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '사용자 구독 태그 제거' })
  @ApiBearerAuth()
  async removeSubscription(
    @AuthUser() user: AuthUserDto,
    @Param() params: TagSubscriptionRequestDto,
  ): Promise<void> {
    const { id: userId } = user;
    const { id: tagId } = params;

    await this.tagService.getTagByIdOrFail(tagId);

    const option = { userId, tagId };
    const subscription = await this.tagService.getSubscription(option);
    if (!subscription) {
      throw new BadRequestException('구독하지 않은 태그입니다.');
    }

    return this.tagService.removeSubscription(subscription);
  }
}
