import { ApiProperty } from '@nestjs/swagger';

export class S3ConfigDto {
  @ApiProperty({ example: 'us-east-1', description: 'AWS 리전' })
  region: string;

  @ApiProperty({ example: 'my-file-bucket', description: 'S3 버킷명' })
  bucketName: string;

  @ApiProperty({ example: 'connected', description: '연결 상태' })
  status: string;
}

export class S3ClientResponseDto {
  @ApiProperty({ example: 'S3 클라이언트가 성공적으로 생성되었습니다.' })
  message: string;

  @ApiProperty({ type: S3ConfigDto })
  config: S3ConfigDto;
} 