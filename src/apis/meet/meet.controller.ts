import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { FcmService } from '../fcm/fcm.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { MeetService } from './meet.service';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from 'src/lib/enums/user.role.enum';
import {
  AuthUserDto,
  MeetCommentRequestDto,
  MeetCommentResponseDto,
  MeetDetailRequestDto,
  MeetDetailResponseDto,
  MeetOpenRequestDto,
  MeetRequestDto,
  MeetResponseDto,
  PaginationDto,
} from 'src/dtos';
import { AuthUser } from 'src/lib/decorators';
import { paginate } from 'src/lib/utils/pagination.util';
import { UserService } from '../user/user.service';
import {
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Meet } from 'src/entities';
import { productArray } from 'src/lib/utils/array.util';

@Controller('meet')
@ApiTags('meet')
export class MeetController {
  constructor(
    private readonly meetService: MeetService,
    private readonly userService: UserService,
    private readonly fcmService: FcmService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({
    summary: '참여 가능한 모임 목록을 반환; 성별, 나이, 시간, (구독) 필터링',
  })
  @ApiBearerAuth()
  async getMeets(
    @AuthUser() user: AuthUserDto,
    @Query() payload: MeetRequestDto,
  ): Promise<MeetResponseDto[]> {
    const { id: userId } = user;
    const { subscribed, ...pagination } = payload;

    const { gender, age, subscriptions } =
      await this.userService.getUserWithTagsById(userId);
    if (!gender || !age) {
      throw new BadRequestException(
        '사용자의 성별 또는 나이가 입력되지 않았습니다.',
      );
    }

    const tagOption = subscribed
      ? await (async () => {
          const tagIds = subscriptions.map((sub) => sub.tagId);
          return { tagId: In(tagIds) };
        })()
      : {};
    const expiredOption = { meetTime: MoreThanOrEqual(new Date()) };

    const where = productArray<FindOptionsWhere<Meet>>([
      [{ ...tagOption, ...expiredOption }],
      [{ gender: IsNull() }, { gender }],
      [{ minAge: IsNull() }, { minAge: LessThanOrEqual(age) }],
      [{ maxAge: IsNull() }, { maxAge: MoreThanOrEqual(age) }],
    ]);
    const page = paginate(pagination);

    const result = await this.meetService.getMeets(where, page);
    return result.map(MeetResponseDto.of);
  }

  @Get('/join')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '참여 완료 및 참여 상태인 모임 목록을 반환' })
  @ApiBearerAuth()
  async getJoinedMeet(
    @AuthUser() user: AuthUserDto,
    @Query() payload: PaginationDto,
  ): Promise<MeetResponseDto[]> {
    const { id: userId } = user;
    const { ...pagination } = payload;

    const where: FindOptionsWhere<Meet>[] = [
      { participations: { user: { id: userId } } },
      { host: { id: userId } },
    ];
    const page = paginate(pagination);

    const result = await this.meetService.getMeets(where, page);
    return result.map(MeetResponseDto.of);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '모임 상세 정보를 반환' })
  @ApiBearerAuth()
  async getMeet(
    @Param() payload: MeetDetailRequestDto,
  ): Promise<MeetDetailResponseDto> {
    const { id } = payload;

    const meet = await this.meetService.getMeetById(id);
    return MeetDetailResponseDto.of(meet);
  }

  @Get('/:id/comment')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '모임에 대한 댓글 목록을 반환' })
  @ApiBearerAuth()
  async getComments(
    @Param() payload: MeetDetailRequestDto,
  ): Promise<MeetCommentResponseDto[]> {
    const { id: meetId } = payload;

    const comments = await this.meetService.getCommentsByMeetId(meetId);
    return comments.map(MeetCommentResponseDto.of);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '새로운 모임을 개설' })
  @ApiBearerAuth()
  async addMeet(
    @AuthUser() user: AuthUserDto,
    @Body() payload: MeetOpenRequestDto,
  ): Promise<void> {
    const { id: hostId } = user;
    const { tagId } = payload;

    const { id } = await this.meetService.addMeet({ hostId, ...payload });

    const targets = await this.userService.getUsersByTagId(tagId);

    await Promise.all(
      targets
        .filter((target) => target.id !== hostId)
        .map((target) =>
          this.fcmService.sendMessageNewMeet(target.fcmToken, id),
        ),
    );
  }

  @Post('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '개설된 모임에 참여' })
  @ApiBearerAuth()
  async joinMeet(
    @AuthUser() user: AuthUserDto,
    @Param() params: MeetDetailRequestDto,
  ): Promise<void> {
    const { id: meetId } = params;
    const { id: userId } = user;

    const { gender: userGender, age: userAge } =
      await this.userService.getUserById(userId);

    const meet = await this.meetService.getMeetById(meetId);
    if (!meet) {
      throw new BadRequestException('존재하지 않는 모임입니다.');
    }

    const { participations, maxParticipants, gender, minAge, maxAge } = meet;

    const targets = [meet.host, ...participations.map((part) => part.user)];
    if (targets.map((target) => target.id).includes(userId)) {
      throw new BadRequestException('이미 모임에 참여한 사용자입니다.');
    }

    if (participations.length + 1 >= maxParticipants) {
      throw new BadRequestException('모임의 최대 인원을 초과했습니다.');
    }

    if (gender !== null && gender !== userGender) {
      throw new BadRequestException('모임의 성별 조건을 만족하지 않습니다.');
    }

    if (
      (minAge !== null && minAge > userAge) ||
      (maxAge !== null && maxAge < userAge)
    ) {
      throw new BadRequestException('모임의 나이 조건을 만족하지 않습니다.');
    }

    await this.meetService.addParticipation({ meetId, userId });

    await Promise.all(
      targets.map((target) =>
        this.fcmService.sendMessageNewParticipant(target.fcmToken, meetId),
      ),
    );
  }

  @Post('/:id/comment')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: '모임에 대한 댓글을 작성' })
  @ApiBearerAuth()
  async addComment(
    @AuthUser() user: AuthUserDto,
    @Param() params: MeetDetailRequestDto,
    @Body() payload: MeetCommentRequestDto,
  ): Promise<void> {
    const { id: meetId } = params;
    const { id: userId } = user;

    const meet = await this.meetService.getMeetById(meetId);
    if (!meet) {
      throw new BadRequestException('존재하지 않는 모임입니다.');
    }

    const { host, participations } = meet;
    const targets = [host, ...participations.map((part) => part.user)];

    if (!targets.map((target) => target.id).includes(userId)) {
      throw new BadRequestException('모임에 참여하지 않은 사용자입니다.');
    }
    await this.meetService.addComment({ meetId, userId, ...payload });

    await Promise.all(
      targets
        .filter((target) => target.id !== userId)
        .map((target) =>
          this.fcmService.sendMessageNewReply(target.fcmToken, meetId),
        ),
    );
  }
}
