import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNegative,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Validate,
} from 'class-validator';
import {
  LOCUS_MEMBERSHIP_STATUS,
  LOCUS_SIDE_LOADING,
} from 'src/common/enum/locus.enum';
import {
  ORDER_BY,
  ORDER_DIRECTION,
  PAGINATION,
} from 'src/common/enum/filters.enum';

export class LocusFilterDto {
  @ApiProperty({ description: 'Search by locus id', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({ description: 'Load locus members ', required: false })
  @IsOptional()
  @IsEnum(LOCUS_SIDE_LOADING, {
    message: 'sideLoading param can be only 1 or undefined',
  })
  @Type(() => Number)
  sideLoading?: LOCUS_SIDE_LOADING;

  @ApiProperty({ description: 'Locus assembly id', required: false })
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiProperty({ description: 'Region id filter', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  regionId?: number;

  @ApiProperty({
    description: 'Membership status',
    required: false,
    enum: LOCUS_MEMBERSHIP_STATUS,
  })
  @IsOptional()
  @IsString()
  @IsEnum(LOCUS_MEMBERSHIP_STATUS)
  membershipStatus?: string;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: PAGINATION.DEFAULT_PAGE,
  })
  @IsOptional()
  @IsNumber()
  @Validate((value) => value >= 0, {
    message: 'Page should be greater or equal than 0',
  })
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: PAGINATION.DEFAULT_PAGE_SIZE,
  })
  @IsOptional()
  @IsNumber()
  @Max(PAGINATION.DEFAULT_PAGE_SIZE, {
    message: 'Page size should be less or equal than 1000',
  })
  @Validate((value) => value >= 0, {
    message: 'Page size should be greater or equal than 0',
  })
  @Type(() => Number)
  size?: number;

  //orders
  @ApiProperty({
    description: 'Order by',
    required: false,
    enum: ORDER_BY,
  })
  @IsOptional()
  @IsEnum(ORDER_BY)
  orderBy?: ORDER_BY;

  @ApiProperty({
    description: 'Order direction',
    required: false,
    enum: ORDER_DIRECTION,
    default: ORDER_DIRECTION.ASC,
  })
  @IsOptional()
  @IsString()
  @IsEnum(ORDER_DIRECTION)
  orderDirection?: ORDER_DIRECTION;
}
