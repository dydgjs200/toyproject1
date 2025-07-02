import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  fileId: number;             // 자동 증가하는 내부 ID (API에서 사용)

  @Column({ unique: true })
  uuid: string;           // S3에 저장된 uuid

  @Column()
  originalName: string;   // 원본 파일명

  @Column()
  s3Key: string;          // S3 Key (uploads/user_{userId}/uuid.확장자)

  @Column()
  s3Url: string;          // S3 URL

  @Column()
  userId: number;         // 업로더

  @CreateDateColumn()
  createdAt: Date;        // 업로드 일시
}