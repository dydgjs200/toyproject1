import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class FileDto {
    @ApiProperty({ description: '파일 ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    fileId: number;

    @ApiProperty({ description: 'S3 URL', example: 'https://bucket.s3.region.amazonaws.com/uploads/user_1/uuid.jpg' })
    @IsString()
    url: string;

    @ApiProperty({ description: '파일 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    uuid: string;

    @ApiProperty({ description: '원본 파일명', example: 'example.jpg' })
    @IsString()
    originalName: string;

    @ApiProperty({ description: '업로더 ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    userId: number;

    @ApiProperty({ description: '업로드 일시', example: '2024-01-01T00:00:00.000Z' })
    @IsDate()
    createdAt: Date;
}

export class UploadFileResponseDto {
    @ApiProperty({ description: '응답 메시지', example: '업로드 성공' })
    @IsString()
    message: string;

    @ApiProperty({ description: '파일 ID', example: 1 })
    @IsNumber()
    fileId: number;

    @ApiProperty({ description: 'S3 URL', example: 'https://bucket.s3.region.amazonaws.com/uploads/user_1/uuid.jpg' })
    @IsString()
    url: string;

    @ApiProperty({ description: '파일 UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    uuid: string;
}