import { Controller, Param, Post } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('convert')
export class ConvertController {
    constructor(private readonly convertService: ConvertService) {}

    @Post('wordToPdf/:fileId')
    @ApiOperation({ summary: 'Word 파일을 PDF로 변환' })
    async wordToPdf(@Param('fileId') fileId: number) {
        return this.convertService.wordToPdf(fileId);
    }
}
