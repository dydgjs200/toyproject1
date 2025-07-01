import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3ClientResponseDto } from './dto/s3-response.dto';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {}

  // S3 설정 정보 반환
  getS3Config() {
    return {
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      bucketName: this.configService.get<string>('AWS_S3_BUCKET_NAME') || '',
    };
  }

  createS3Client(): S3ClientResponseDto {
    const config = this.getS3Config();
    this.logger.log('S3 클라이언트 생성됨');
    
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    // Swagger용 깔끔한 응답 객체 반환
    return {
      message: 'S3 클라이언트가 성공적으로 생성되었습니다.',
      config: {
        region: config.region,
        bucketName: config.bucketName,
        status: 'connected'
      }
    };
  }

  // 파일 키 생성
  generateFileKey(originalName: string, userId: number): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `uploads/user_${userId}/${timestamp}.${extension}`;
  }

  // S3 URL 생성
  generateS3Url(key: string): string {
    const config = this.getS3Config();
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
  }
} 