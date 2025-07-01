import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity()
export class File {
  @ApiProperty({ description: '파일 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '원본 파일명', example: 'document.pdf' })
  @Column()
  originalName: string;

  @ApiProperty({ description: 'S3에 저장된 파일명', example: 'uuid-document.pdf' })
  @Column()
  fileName: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 1024000 })
  @Column('bigint')
  fileSize: number;

  @ApiProperty({ description: '파일 MIME 타입', example: 'application/pdf' })
  @Column()
  mimeType: string;

  @ApiProperty({ description: 'S3 버킷 URL', example: 'https://bucket.s3.region.amazonaws.com/file.pdf' })
  @Column()
  s3Url: string;

  @ApiProperty({ description: 'S3 버킷명', example: 'my-file-bucket' })
  @Column()
  bucketName: string;

  @ApiProperty({ description: 'S3 키', example: 'uploads/user1/document.pdf' })
  @Column()
  s3Key: string;

  @ApiProperty({ description: '파일 설명', example: '중요한 문서입니다.' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: '파일 카테고리', example: 'document' })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: '파일 공개 여부', example: false })
  @Column({ default: false })
  isPublic: boolean;

  @ApiProperty({ description: '파일 만료일', example: '2024-12-31' })
  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 사용자와의 관계
  @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
} 