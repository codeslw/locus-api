// src/common/utils/pagination.utils.ts

import { NotFoundException } from '@nestjs/common';
import { QueryPaginationDto } from '../dto/query-pagination.dto';
import { PAGINATION } from '../enum/filters.enum';

export interface PaginateOutput<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    totalPerPage: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export const paginate = (
  query: QueryPaginationDto,
): { skip: number; take: number } => {
  const size = Math.abs(+query.size) || PAGINATION.DEFAULT_PAGE_SIZE;
  const page = Math.abs(+query.page) || PAGINATION.DEFAULT_PAGE;
  return {
    skip: size * page,
    take: size,
  };
};

export const paginateOutput = <T>(
  data: T[],
  total: number,
  query: QueryPaginationDto,
  //   page: number,
  //   limit: number,
): PaginateOutput<T> => {
  const size = Math.abs(+query.size) || PAGINATION.DEFAULT_PAGE_SIZE;
  const page = Math.abs(+query.page) || PAGINATION.DEFAULT_PAGE;

  const lastPage = Math.ceil(total / size);

  // if data is empty, return empty array
  if (!data.length) {
    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        totalPerPage: size,
        prevPage: null,
        nextPage: null,
      },
    };
  }

  // if page is greater than last page, throw an error
  if (page > lastPage) {
    throw new NotFoundException(
      `Page ${page} not found. Last page is ${lastPage}`,
    );
  }

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      totalPerPage: size,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < lastPage ? page + 1 : null,
    },
  };
};
