import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Put, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegisterValidationPipe } from 'src/common/pipe/register-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  async create(
    @Body(RegisterValidationPipe) createUserDto: CreateUserDto,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 탈퇴', description: 'ID로 사용자가 탈퇴됩니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async delete(@Param('userId', ParseIntPipe) userId: number, @Request() req): Promise<void> {
    return this.userService.delete(userId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 수정', description: 'ID로 특정 사용자를 수정합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  async update(@Param('userId', ParseIntPipe) userId: number, @Body(RegisterValidationPipe) updateUserDto: UpdateUserDto, @Request() req): Promise<void> {
    return this.userService.update(userId, updateUserDto);
  } 

  @Get('getAllUser')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @ApiOperation({
    summary: '전체 사용자 목록 조회',
    description: '등록된 모든 사용자 목록을 조회합니다.',
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 사용자 조회', description: 'ID로 특정 사용자를 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('userId', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }
}
