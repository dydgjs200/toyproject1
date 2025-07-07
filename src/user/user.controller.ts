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
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        description: { type: 'string', example: '회원가입 성공' },
        data: {
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
          }
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: '이미 존재하는 사용자명',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 409 },
        description: { type: 'string', example: '이미 존재하는 사용자명' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 탈퇴', description: 'ID로 사용자가 탈퇴됩니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: { type: 'string', example: '사용자 삭제 성공' },
        data: { type: 'object' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증이 필요합니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        description: { type: 'string', example: '인증이 필요합니다.' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 404 },
        description: { type: 'string', example: '사용자를 찾을 수 없음' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  async delete(@Param('userId', ParseIntPipe) userId: number, @Request() req): Promise<void> {
    // 토큰의 사용자 ID와 요청의 사용자 ID가 일치하는지 확인
    if (req.user.sub !== userId) {
      throw new UnauthorizedException('자신의 계정만 삭제할 수 있습니다.');
    }
    return this.userService.delete(userId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 수정', description: 'ID로 특정 사용자를 수정합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 수정 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: { type: 'string', example: '사용자 수정 성공' },
        data: { type: 'object' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증이 필요합니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        description: { type: 'string', example: '인증이 필요합니다.' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 404 },
        description: { type: 'string', example: '사용자를 찾을 수 없음' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  async update(@Param('userId') userId: number, @Body(RegisterValidationPipe) updateUserDto: UpdateUserDto, @Request() req): Promise<void> {
    // 토큰의 사용자 ID와 요청의 사용자 ID가 일치하는지 확인
    if (req.user.sub !== userId) {
      throw new UnauthorizedException('자신의 계정만 수정할 수 있습니다.');
    }
    return this.userService.update(userId, updateUserDto);
  } 

  @Get('getAllUser')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @ApiOperation({
    summary: '전체 사용자 목록 조회',
    description: '등록된 모든 사용자 목록을 조회합니다.',
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: { type: 'string', example: '사용자 목록 조회 성공' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              username: { type: 'string', example: 'testuser1' },
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
          }
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증이 필요합니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        description: { type: 'string', example: '인증이 필요합니다.' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 사용자 조회', description: 'ID로 특정 사용자를 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 조회 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: { type: 'string', example: '사용자 조회 성공' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'testuser1' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증이 필요합니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        description: { type: 'string', example: '인증이 필요합니다.' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 404 },
        description: { type: 'string', example: '사용자를 찾을 수 없음' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('userId', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }
}
