import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({example: 'testuser1', description: '사용자명'})
    @IsString()
    username: string;

    @ApiProperty({example: 'password123', description: '비밀번호'})
    @IsString()
    password: string;
}