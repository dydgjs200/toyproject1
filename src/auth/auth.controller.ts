import { Controller, Post, Body, UnauthorizedException, UseGuards, UseFilters, ValidationPipe, NotFoundException, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthInvalidPasswordException, AuthUserNotFoundException } from './auth.exception';
import { error } from 'console';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '사용자 로그인' })
  @ApiBody({type: LoginDto})
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    try{
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      return this.authService.login(user);
    }catch(error){
      if (error instanceof AuthUserNotFoundException)
        throw new NotFoundException(error.message)
      if (error instanceof AuthInvalidPasswordException)
        throw new UnauthorizedException(error.message)
    }

    throw error
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃' })
  @UseGuards(JwtAuthGuard)
  async logout(@Body() body: { username: string; password: string }) {
    return {message: '로그아웃 성공. 클라이언트에서 토큰 삭제'}
  }
}