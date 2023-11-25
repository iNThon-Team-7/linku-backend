import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { FcmService } from '../fcm/fcm.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { MeetService } from './meet.service';
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthUserDto } from 'src/dtos/common/auth.user.dto';
import { AuthUser } from 'src/lib/decorators/auth.user.decorator';
import { Role } from 'src/lib/enums/user.role.enum';
import {
  MeetCommentRequestDto,
  MeetCommentResponseDto,
  MeetGetRequestDto,
  MeetResponseDto,
} from 'src/dtos';

@Controller('meet')
@ApiTags('meet')
export class MeetController {
  constructor(
    private readonly meetService: MeetService,
    private readonly fcmService: FcmService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.USER))
  @ApiOperation({ summary: 'isTag에 따라 category 포함해 meet를 반환' })
  @ApiBearerAuth()
  async getMeet(
    @AuthUser() user: AuthUserDto,
    @Query() payload: MeetGetRequestDto,
  ): Promise<MeetResponseDto[]> {
    const { isTag } = payload;
    const result = await this.meetService.getMeets(user, isTag);
    return result.map(MeetResponseDto.of);
  }

  async getComment(
    @AuthUser() user: AuthUserDto,
    @Query() payload: MeetCommentRequestDto,
  ) {
    const { meetId } = payload;
    const result = await this.meetService.getComment(user, meetId);
    return result.map(MeetCommentResponseDto.of);
  }
}
