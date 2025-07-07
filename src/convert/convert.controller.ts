import { BadRequestException, Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileService } from 'src/file/file.service';
import { PdfUploadResponseDto } from 'src/file/dto/pdf-upload-response.dto';
import { WordToPdfDto } from './dto/word-to-pdf.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('convert')
export class ConvertController {
    constructor(private readonly convertService: ConvertService, private readonly fileService: FileService) {}

    @Post('wordToPdf')
    @ApiOperation({ summary: 'Word 파일을 PDF로 변환 후 S3 저장' })
    @ApiResponse({
        status: 200,
        description: '변환된 PDF 파일의 S3 저장 정보',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '변환된 PDF 파일의 S3 저장 정보' },
                data: {
                    type: 'object',
                    properties: {
                        fileId: { type: 'number', example: 1 },
                        uuid: { type: 'string', example: 'uuid-string' },
                        originalName: { type: 'string', example: 'document.pdf' },
                        s3Key: { type: 'string', example: 'uploads/user_1/uuid.pdf' },
                        s3Url: { type: 'string', example: 'https://s3.amazonaws.com/bucket/uploads/user_1/uuid.pdf' },
                        userId: { type: 'number', example: 1 },
                        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
                    }
                },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청입니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 400 },
                description: { type: 'string', example: '잘못된 요청입니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 401 },
                description: { type: 'string', example: '인증이 필요합니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @UseGuards(JwtAuthGuard)
    async wordToPdf(@Body() body: WordToPdfDto): Promise<PdfUploadResponseDto> {
        const { fileId, userId } = body;
        if (!fileId) throw new BadRequestException('fileId가 필요합니다.');     
        if (!userId) throw new BadRequestException('userId가 필요합니다.');

        // fileId로 파일 조회
        const file = await this.fileService.getFile(fileId);
        if (!file || !file.s3Url) throw new BadRequestException('파일을 찾을 수 없습니다.');

        // 파일 변환
        const pdfBuffer = await this.convertService.wordToPdfConvert(file.s3Url);
        const pdfFileName = file.originalName.replace(/\.(docx|doc)$/i, '.pdf');
        const pdfUploadResult = await this.fileService.uploadPdfBufferToS3(pdfBuffer, pdfFileName, userId);

        return pdfUploadResult;
    }
}