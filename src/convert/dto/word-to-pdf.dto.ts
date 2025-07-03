import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WordToPdfDto {
  @ApiProperty({ example: 22, description: '변환할 파일의 ID' })
  @IsNumber()
  fileId: number;

  @ApiProperty({ example: 7, description: '변환 요청자(소유자)의 userId' })
  @IsNumber()
  userId: number;
} 