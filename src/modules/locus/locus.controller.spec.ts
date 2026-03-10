import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { UnauthorizedAccessException } from '../../common/exceptions/app.exceptions';
import { LOCUS_SIDE_LOADING } from '../../common/enum/locus.enum';
import { Role } from '../../common/enum/roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';

describe('LocusController', () => {
  let app: INestApplication;
  let currentRole: Role;

  const mockLocusService = {
    getLocusesBasedOnRole: jest.fn((filters, role: Role) => {
      if (
        role === Role.NORMAL &&
        filters.sideLoading === LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS
      ) {
        throw new UnauthorizedAccessException(
          'Normal user can not access locus members!',
        );
      }

      return Promise.resolve({
        data: [
          {
            id: 1,
            assemblyId: `${role}-assembly`,
            sideLoading: filters.sideLoading ?? null,
          },
        ],
        meta: {
          role,
          sideLoading: filters.sideLoading ?? null,
        },
      });
    }),
  };

  beforeEach(async () => {
    currentRole = Role.ADMIN;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [
        {
          provide: LocusService,
          useValue: mockLocusService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { role: currentRole };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it.each([
    [Role.ADMIN, 200, { role: Role.ADMIN, sideLoading: null }],
    [Role.LIMITED, 200, { role: Role.LIMITED, sideLoading: null }],
    [Role.NORMAL, 200, { role: Role.NORMAL, sideLoading: null }],
  ])(
    'GET /api/v1/locus returns a response for %s role',
    async (role, statusCode, expectedMeta) => {
      currentRole = role;

      await request(app.getHttpServer())
        .get('/api/v1/locus')
        .query({ id: 1, page: 1, size: 10, assemblyId: 'ASM-001' })
        .expect(statusCode)
        .expect(({ body }) => {
          expect(body.meta).toEqual(expectedMeta);
          expect(body.data[0].assemblyId).toBe(`${role}-assembly`);
        });

      expect(mockLocusService.getLocusesBasedOnRole).toHaveBeenCalledWith(
        {
          id: 1,
          page: 1,
          size: 10,
          assemblyId: 'ASM-001',
        },
        role,
      );
    },
  );

  it('GET /api/v1/locus includes sideLoading for admin requests', async () => {
    currentRole = Role.ADMIN;

    await request(app.getHttpServer())
      .get('/api/v1/locus')
      .query({ sideLoading: LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS })
      .expect(200)
      .expect(({ body }) => {
        expect(body.meta).toEqual({
          role: Role.ADMIN,
          sideLoading: LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS,
        });
      });

    expect(mockLocusService.getLocusesBasedOnRole).toHaveBeenCalledWith(
      {
        sideLoading: LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS,
      },
      Role.ADMIN,
    );
  });

  it('GET /api/v1/locus rejects sideLoading for normal users', async () => {
    currentRole = Role.NORMAL;

    await request(app.getHttpServer())
      .get('/api/v1/locus')
      .query({ sideLoading: LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS })
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Normal user can not access locus members!',
        error: 'Unauthorized',
      });

    expect(mockLocusService.getLocusesBasedOnRole).toHaveBeenCalledWith(
      {
        sideLoading: LOCUS_SIDE_LOADING.SHOW_LOCUS_MEMBERS,
      },
      Role.NORMAL,
    );
  });
});
