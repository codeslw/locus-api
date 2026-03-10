import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/common/enum/roles.enum";

export class UserResponseDto {
    @ApiProperty({ description: 'User ID' })
    id: string;
  
    @ApiProperty({ description: 'User email' })
    email: string;
  
    @ApiProperty({ description: 'User role', enum: Role })
    role: Role;
  
    @ApiProperty({ description: 'User creation date' })
    createdAt: Date;
  
    @ApiProperty({ description: 'User last update date' })
    updatedAt: Date;
  }