import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { S3ClientResponseDto } from './dto/s3-response.dto';

@ApiTags('S3 관리')
@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('create')
    async createS3Client(): Promise<S3ClientResponseDto> {
        return this.s3Service.createS3ClientResponse();
    }

    @Get('config')
    async getS3Config() {
        return await this.s3Service.getS3Config();
    }
}
