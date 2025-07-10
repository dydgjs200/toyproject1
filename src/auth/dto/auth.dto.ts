import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({example: 'testuser1', description: '사용자명'})
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({example: 'password123', description: '비밀번호'})
    @IsString()
    @IsNotEmpty()
    password: string;
}