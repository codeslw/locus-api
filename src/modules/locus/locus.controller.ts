import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { LocusService } from "./locus.service";
import { LocusFilterDto } from "./dto/locus-filter.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequestWithUser } from "src/common/types/request-with-user.type";
import { Role } from "src/common/enum/roles.enum";
import { ApiBearerAuth } from "@nestjs/swagger";


@Controller("/api/v1/locus")
export class LocusController {

    constructor(private locusService: LocusService) {

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access_token')
    getLocuses(@Req() req: RequestWithUser, @Query() filters: LocusFilterDto) {
        return this.locusService.getLocusesBasedOnRole(filters, req?.user?.role ?? Role.ADMIN)
    }


}