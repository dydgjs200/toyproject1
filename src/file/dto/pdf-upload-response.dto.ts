import { ApiProperty } from '@nestjs/swagger';

export class PdfUploadResponseDto {
  @ApiProperty({ description: 'PDF 파일의 고유 ID' })
  fileId: number;

  @ApiProperty({ description: 'S3에 저장된 파일의 UUID' })
  uuid: string;

  @ApiProperty({ description: '원본 파일명' })
  originalName: string;

  @ApiProperty({ description: 'S3 Key' })
  s3Key: string;

  @ApiProperty({ description: 'S3 URL' })
  s3Url: string;

  @ApiProperty({ description: '업로더의 userId' })
  userId: number;

  @ApiProperty({ description: '업로드 일시', type: String, format: 'date-time' })
  createdAt: Date;
} 