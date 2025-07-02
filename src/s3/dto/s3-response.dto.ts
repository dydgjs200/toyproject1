import { ApiProperty } from '@nestjs/swagger';

export class S3ConfigDto {
  region: string;
  bucketName: string;
  status: string;
}

export class S3ClientResponseDto {
  message: string;
  config: S3ConfigDto;
} 