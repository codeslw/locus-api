import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { LocusFilterDto } from './dto/locus-filter.dto';
import { paginate, paginateOutput } from '../../common/utils/pagination.utils';
import { LocusResponseDto } from './dto/locus-response.dto';

@Injectable()
export class LocusRepository {
  constructor(private prisma: PrismaService) {}

  private buildWhereClause(filters: LocusFilterDto) {
    const where: any = {};
    if (filters.id) where.id = filters.id;
    if (filters.assemblyId) where.assemblyId = filters.assemblyId;
    if (filters.regionId || filters.membershipStatus) {
      where.locusMembers = {
        some: {
          ...(filters.regionId && { regionId: filters.regionId }),
          ...(filters.membershipStatus && {
            membershipStatus: filters.membershipStatus,
          }),
        },
      };
    }
    return where;
  }

  async getLocuses(filters: LocusFilterDto) {
    const where = this.buildWhereClause({
      ...filters,
      membershipStatus: undefined,
      regionId: undefined,
    });
    const [data, total] = await Promise.all([
      this.prisma.locus.findMany({
        where,
        ...paginate(filters),
        ...(filters.orderBy &&
          filters.orderDirection && {
            orderBy: {
              [`${filters.orderBy}`]: filters.orderDirection,
            },
          }),
      }),
      this.prisma.locus.count({ where }),
    ]);

    return paginateOutput<LocusResponseDto>(data as any, total, filters);
  }

  async getLocusesWithMembers(filters: LocusFilterDto) {
    const where = this.buildWhereClause(filters);
    const [data, total] = await Promise.all([
      this.prisma.locus.findMany({
        where,
        include: { locusMembers: true },
        ...paginate(filters),
        ...(filters.orderBy &&
          filters.orderDirection && {
            orderBy: {
              [`${filters.orderBy}`]: filters.orderDirection,
            },
          }),
      }),
      this.prisma.locus.count({ where }),
    ]);

    return paginateOutput<LocusResponseDto>(data as any, total, filters);
  }

  async getLocusesForLimitedUsers(filters: LocusFilterDto) {
    const ALLOWED_REGION_IDS = [86703171, 41436963, 88383697];
    const baseWhere = this.buildWhereClause(filters);

    const limitedWhere = {
      ...baseWhere,
      locusMembers: {
        some: {
          ...(baseWhere.locusMembers?.some || {}),
          regionId: { in: ALLOWED_REGION_IDS },
        },
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.locus.findMany({
        where: limitedWhere,
        include: {
          locusMembers: {
            where: {
              regionId: { in: ALLOWED_REGION_IDS },
            },
          },
        },
        ...paginate(filters),
        ...(filters.orderBy &&
          filters.orderDirection && {
            orderBy: {
              [`${filters.orderBy}`]: filters.orderDirection,
            },
          }),
      }),
      this.prisma.locus.count({ where: limitedWhere }),
    ]);

    return paginateOutput<LocusResponseDto>(data as any, total, filters);
  }
}
