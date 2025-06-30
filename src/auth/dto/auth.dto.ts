import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({example: 'testuser1', description: '사용자명'})
    username: string;

    @ApiProperty({example: 'password123', description: '비밀번호'})
    password: string;
}