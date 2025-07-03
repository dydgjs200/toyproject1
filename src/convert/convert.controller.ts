import { BadRequestException, Controller, Param, Post } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { FileService } from 'src/file/file.service';
import { PdfUploadResponseDto } from 'src/file/dto/pdf-upload-response.dto';

@Controller('convert')
export class ConvertController {
    constructor(private readonly convertService: ConvertService, private readonly fileService: FileService) {}

    @Post('wordToPdf/:fileId')
    @ApiOperation({ summary: 'Word 파일을 PDF로 변환 후 S3에 uuid로 저장, DB에는 originalName 저장' })
    @ApiOkResponse({ type: PdfUploadResponseDto, description: '변환된 PDF 파일의 S3 저장 정보' })
    async wordToPdf(@Param('fileId') fileId: number): Promise<PdfUploadResponseDto> {
        // 파일 경로 예외처리
        if (!fileId) throw new BadRequestException('fileId가 필요합니다.');

        // fileId로 파일 조회
        const file = await this.fileService.getFile(fileId);
        if (!file || !file.s3Url) throw new BadRequestException('파일을 찾을 수 없습니다.');

        // 파일 변환
        const pdfBuffer = await this.convertService.wordToPdfConvert(file.s3Url);
        const pdfFileName = file.originalName.replace(/\.(docx|doc)$/i, '.pdf');
        const pdfUploadResult = await this.fileService.uploadPdfBufferToS3(pdfBuffer, pdfFileName, file.userId);

        return pdfUploadResult;
    }
}
