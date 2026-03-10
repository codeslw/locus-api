import { ApiProperty } from '@nestjs/swagger';

export class LocusMembersResponseDto {
    @ApiProperty({ description: 'The unique identifier for the locus membership record', example: 101 })
    id: number;

    @ApiProperty({ 
        description: 'The Unique RNA Sequence (URS) identifier with TaxID suffix', 
        example: 'URS0000000001_9606' 
    })
    userTaxId: string;

    @ApiProperty({ description: 'The internal identifier for the specific genomic region', example: 5502 })
    regionId: number;

    @ApiProperty({ 
        description: 'The status of the membership within the locus (e.g., "member", "representative")', 
        example: 'member' 
    })
    membershipStatus: string;

    @ApiProperty({ description: 'The ID of the parent locus', example: 1 })
    locusId: number;
}