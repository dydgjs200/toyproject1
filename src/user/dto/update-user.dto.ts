import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '사용자명', example: 'newusername', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '비밀번호', example: 'newpassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
