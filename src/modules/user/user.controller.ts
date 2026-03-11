import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
    type: [UserResponseDto],
  })
  async findAll() {
    return this.userService.findAll();
  }
  //temporarily disabled user crud operations
  // @Get(':id')
  // @ApiOperation({ summary: 'Get a user by ID' })
  // @ApiResponse({ status: 200, description: 'User fetched successfully', type: UserResponseDto })
  // async findById(@Param('id') id: string) {
  //     return this.userService.findById(id);
  // }

  // @Post()
  // @ApiOperation({ summary: 'Create a user' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  // async create(@Body() createUserDto: CreateUserDto) {
  //     return this.userService.create(createUserDto);
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update a user by ID' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  // async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
  //     return this.userService.update(createUserDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserResponseDto })
  // async delete(@Param('id') id: string) {
  //     return this.userService.delete(id);
  // }
}
