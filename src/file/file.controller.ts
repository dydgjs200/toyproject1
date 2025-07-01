import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @ApiOperation({summary: '파일 업로드'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                userId: {
                    type: 'integer',
                    example: 1,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: '파일 업로드 성공',
        type: Object,
    })
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없습니다.',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: number) {
        return this.fileService.uploadFile(file, userId);
    }
}
