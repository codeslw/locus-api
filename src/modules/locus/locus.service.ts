import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { Role } from 'src/common/enum/roles.enum';
import { LocusRepository } from './locus.repository';
import { LocusFilterDto } from './dto/locus-filter.dto';
import { Locus } from 'generated/prisma/client';
import { Request } from 'express';
import { RequestWithUser } from 'src/common/types/request-with-user.type';
import { LOCUS_SIDE_LOADING } from 'src/common/enum/locus.enum';
import { UnauthorizedAccessException } from 'src/common/exceptions/app.exceptions';
import { PaginateOutput } from 'src/common/utils/pagination.utils';
import { LocusResponseDto } from './dto/locus-response.dto';

@Injectable()
export class LocusService {
  constructor(private locusRepository: LocusRepository) {}

  getLocusesBasedOnRole(
    filters: LocusFilterDto,
    role?: Role,
  ): Promise<PaginateOutput<LocusResponseDto>> {
    if (
      role === Role.NORMAL &&
      filters.sideLoading === LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS
    ) {
      throw new UnauthorizedAccessException(
        'Normal user can not access locus members!',
      );
    }
    if (role === Role.LIMITED) {
      return this.locusRepository.getLocusesForLimitedUsers(filters);
    }
    if (filters.sideLoading) {
      return this.locusRepository.getLocusesWithMembers(filters);
    }
    return this.locusRepository.getLocuses(filters);
  }
}
