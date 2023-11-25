import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagResponseDto } from 'src/dtos';

@Controller('tag')
@ApiTags('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: '태그 목록 조회' })
  async getTags() {
    const tags = await this.tagService.getTags();
    return tags.map(TagResponseDto.of);
  }
}
