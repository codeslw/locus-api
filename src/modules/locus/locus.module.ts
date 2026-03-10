import { Module } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { LocusController } from "./locus.controller";
import { LocusService } from "./locus.service";
import { LocusRepository } from "./locus.repository";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { UserService } from "../user/user.service";

@Module({
    imports: [AuthModule],
    exports: [],
    controllers: [LocusController],
    providers: [LocusService, LocusRepository, PrismaService]
})

export class LocusModule {

}