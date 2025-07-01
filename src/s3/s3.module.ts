import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  imports: [ConfigModule],
  providers: [S3Service],
  exports: [S3Service],
  controllers: [S3Controller], // 다른 모듈에서 S3 기능 사용 가능
})
export class S3Module {} 