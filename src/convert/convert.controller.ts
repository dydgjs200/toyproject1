import { BadRequestException, Body, Controller, NotFoundException, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    @UseGuards(JwtAuthGuard)
    async wordToPdf(@Body() body: WordToPdfDto): Promise<PdfUploadResponseDto> {
        const { fileId, userId } = body;

        // fileId로 파일 조회
        const file = await this.fileService.getFile(fileId);

        if(!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }

        if(file.userId !== userId) {
            throw new UnauthorizedException('자신의 파일만 변환할 수 있습니다.');
        }

        // 파일 변환
        const pdfBuffer = await this.convertService.wordToPdfConvert(file.s3Url);

        if(pdfBuffer.length === 0) {
            throw new BadRequestException('파일 변환 실패');
        }

        const pdfFileName = file.originalName.replace(/\.(docx|doc)$/i, '.pdf');
        const pdfUploadResult = await this.fileService.uploadPdfBufferToS3(pdfBuffer, pdfFileName, userId);

        if(!pdfUploadResult) {
            throw new BadRequestException('파일 업로드 실패');
        }

        return pdfUploadResult;
    }
}