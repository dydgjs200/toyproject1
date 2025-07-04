import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자명',
    example: 'testuser',
    minLength: 3,
    maxLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '비밀번호',
    example: '@password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
