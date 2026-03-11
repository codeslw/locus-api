import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/enum/roles.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'test-admin2@test.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.NORMAL })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;
}
