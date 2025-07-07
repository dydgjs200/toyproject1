import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '사용자 로그인' })
  @ApiBody({type: LoginDto})
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        description: { type: 'string', example: '로그인 성공' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            userId: { type: 'number', example: 1 }
          }
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: '아이디 또는 비밀번호가 올바르지 않습니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        description: { type: 'string', example: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
    return this.authService.login(user);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃' })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        description: { type: 'string', example: '로그아웃 성공' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: '로그아웃 성공. 클라이언트에서 토큰 삭제' }
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
  @UseGuards(JwtAuthGuard)
  async logout(@Body() body: { username: string; password: string }) {
    return {message: '로그아웃 성공. 클라이언트에서 토큰 삭제'}
  }
}