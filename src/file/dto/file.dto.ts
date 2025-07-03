import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
    @ApiProperty({ description: '파일 ID', example: 1 })
    fileId: number;

    @ApiProperty({ description: 'S3 URL', example: 'https://bucket.s3.region.amazonaws.com/uploads/user_1/uuid.jpg' })
    url: string;

    @ApiProperty({ description: '파일 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    uuid: string;

    @ApiProperty({ description: '원본 파일명', example: 'example.jpg' })
    originalName: string;

    @ApiProperty({ description: '업로더 ID', example: 1 })
    userId: number;

    @ApiProperty({ description: '업로드 일시', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;
}

export class UploadFileResponseDto {
    @ApiProperty({ description: '응답 메시지', example: '업로드 성공' })
    message: string;

    @ApiProperty({ description: '파일 ID', example: 1 })
    fileId: number;

    @ApiProperty({ description: 'S3 URL', example: 'https://bucket.s3.region.amazonaws.com/uploads/user_1/uuid.jpg' })
    url: string;

    @ApiProperty({ description: '파일 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    uuid: string;
}