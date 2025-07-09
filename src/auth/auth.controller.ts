import { Controller, Post, Body, UnauthorizedException, UseGuards, UseFilters } from '@nestjs/common';
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
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    return this.authService.login(user);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃' })
  @UseGuards(JwtAuthGuard)
  async logout(@Body() body: { username: string; password: string }) {
    return {message: '로그아웃 성공. 클라이언트에서 토큰 삭제'}
  }
}