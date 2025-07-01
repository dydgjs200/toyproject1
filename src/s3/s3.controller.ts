import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { S3ClientResponseDto } from './dto/s3-response.dto';

@ApiTags('S3 관리')
@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('create')
    @ApiOperation({ summary: 'S3 클라이언트 생성' })
    @ApiResponse({ 
        status: 201, 
        description: 'S3 클라이언트가 성공적으로 생성되었습니다.',
        type: S3ClientResponseDto
    })
    async createS3Client(): Promise<S3ClientResponseDto> {
        return this.s3Service.createS3ClientResponse();
    }

    @Get('config')
    @ApiOperation({ summary: 'S3 설정 정보 조회' })
    @ApiResponse({ 
        status: 200, 
        description: 'S3 설정 정보를 반환합니다.',
        schema: {
            type: 'object',
            properties: {
                region: { type: 'string', example: 'us-east-1' },
                bucketName: { type: 'string', example: 'my-file-bucket' },
                accessKeyId: { type: 'string', example: 'AKIA...' },
                secretAccessKey: { type: 'string', example: '***' }
            }
        }
    })
    async getS3Config() {
        return await this.s3Service.getS3Config();
    }
}
