import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class PdfUploadResponseDto {
  @ApiProperty({ description: 'PDF 파일의 고유 ID' })
  @IsNumber()
  fileId: number;

  @ApiProperty({ description: 'S3에 저장된 파일의 UUID' })
  @IsString()
  uuid: string;

  @ApiProperty({ description: '원본 파일명' })
  @IsString()
  originalName: string;

  @ApiProperty({ description: 'S3 Key' })
  @IsString()
  s3Key: string;

  @ApiProperty({ description: 'S3 URL' })
  @IsString()
  s3Url: string;

  @ApiProperty({ description: '업로더의 userId' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '업로드 일시', type: String, format: 'date-time' })
  @IsDate()
  createdAt: Date;
} 