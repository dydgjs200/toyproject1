import { Controller, Post, UploadedFile, UseInterceptors, Res, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CloudConvertService } from './cloudconvert.service';
import { FileService } from '../file/file.service';

@Controller('cloudconvert')
export class CloudConvertController {
  constructor(
    private readonly cloudConvertService: CloudConvertService,
    private readonly fileService: FileService,
  ) {}

  @Post('word-to-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async wordToPdf(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) throw new BadRequestException('파일이 업로드되지 않았습니다.');
    const pdfBuffer = await this.cloudConvertService.wordToPdf(file.buffer, file.originalname);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.originalname.replace(/\.(docx|doc)$/i, '.pdf')}"`
    });
    res.send(pdfBuffer);
  }

  @Post('word-url-to-pdf')
  async wordUrlToPdf(@Body('fileId') fileId: number, @Res() res: Response) {
    if (!fileId) throw new BadRequestException('fileId가 필요합니다.');
    const file = await this.fileService.getFile(fileId);
    if (!file || !file.s3Url) throw new BadRequestException('파일을 찾을 수 없습니다.');
    const pdfBuffer = await this.cloudConvertService.wordUrlToPdf(file.s3Url);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileId}.pdf"`
    });
    res.send(pdfBuffer);
  }
} 