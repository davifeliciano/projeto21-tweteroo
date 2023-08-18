import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageDto {
  @IsOptional()
  @Transform((page) => parseInt(page.value))
  @IsInt()
  @Min(1)
  page?: number;
}
