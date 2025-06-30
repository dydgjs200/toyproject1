import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '사용자명', example: 'testuser1' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '해시화된 비밀번호', example: '$2b$10$...' })
  @Column()
  password: string;
}
