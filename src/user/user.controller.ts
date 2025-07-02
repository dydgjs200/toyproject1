import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '회원가입이 성공적으로 완료되었습니다.' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'testuser1' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: '이미 존재하는 사용자명' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.userService.create(createUserDto);

    // 비밀번호를 제외한 사용자 정보 반환
    const { password, ...userWithoutPassword } = user;

    return {
      message: '회원가입이 성공적으로 완료되었습니다.',
      user: userWithoutPassword,
    };
  }

  @Delete(':userId')
  @ApiOperation({ summary: '사용자 삭제', description: 'ID로 특정 사용자를 삭제합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async delete(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.delete(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: '사용자 수정', description: 'ID로 특정 사용자를 수정합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ status: 200, description: '사용자 수정 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async update(@Param('userId', ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    return this.userService.update(userId, updateUserDto);
  } 

  @Get('getAllUser')
  @ApiOperation({
    summary: '전체 사용자 목록 조회',
    description: '등록된 모든 사용자 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공', type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: '특정 사용자 조회', description: 'ID로 특정 사용자를 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ status: 200, description: '사용자 조회 성공', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async findOne(@Param('userId', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

}
