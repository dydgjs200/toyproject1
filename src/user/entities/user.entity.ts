import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { File } from '../../file/entities/file.entity';

@Entity()
export class User {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  @PrimaryGeneratedColumn()
  userId: number;

  @ApiProperty({ description: '사용자명', example: 'testuser1' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '해시화된 비밀번호', example: '$2b$10$...' })
  @Column()
  password: string;

  // 파일과의 관계
  @OneToMany(() => File, file => file.user)
  files: File[];
}
