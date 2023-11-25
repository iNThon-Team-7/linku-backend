import { PaginationDto } from 'src/dtos/common/pagination.dto';
import { FindManyOptions } from 'typeorm';

type FindOptionsPage = Pick<FindManyOptions, 'skip' | 'take'>;

const paginate = ({ page, size }: PaginationDto): FindOptionsPage => ({
  skip: (page - 1) * size,
  take: size,
});

export { FindOptionsPage, paginate };
