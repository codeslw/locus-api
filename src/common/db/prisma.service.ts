import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
  } from '@nestjs/common';
  import { PrismaClient } from "../../../generated/prisma/client";
  import { PrismaPg } from '@prisma/adapter-pg'
  import {Pool} from 'pg'
  


  @Injectable()
  export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
  {
    private readonly logger = new Logger(PrismaService.name);
    constructor() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL + '?options=-c%20search_path%3Drnacen',
          })
          
          // Set search_path on every new connection
          pool.on('connect', (client) => {
            client.query('SET search_path TO rnacen')
          })

        const adapter = new PrismaPg(pool);
        super({adapter, log: ['query', 'info', 'warn', 'error']});
    }
  
    async onModuleInit() {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to the database');
      } catch (error) {
        this.logger.error('Failed to connect to the database:', error);
        throw error;
      }
    }

    
    async onModuleDestroy() {
      try {
        await this.$disconnect();
        this.logger.log('Successfully disconnected from the database');
      } catch (error) {
        this.logger.error('Error disconnecting from the database:', error);
      }
    }
  
    async healthCheck() {
      try {
        await this.$queryRaw`SELECT 1`;
        return { status: 'healthy' };
      } catch (error) {
        this.logger.error('Database health check failed:', error);
        throw error;
      }
    }
  }
  