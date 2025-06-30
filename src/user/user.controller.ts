import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.userService.create(createUserDto);
    
    // 비밀번호를 제외한 사용자 정보 반환
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: '회원가입이 성공적으로 완료되었습니다.',
      user: userWithoutPassword,
    };
  }

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }
} 