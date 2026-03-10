import { Type } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: Number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: Number;
}