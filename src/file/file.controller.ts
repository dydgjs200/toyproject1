import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { FileDto, UploadFileResponseDto } from './dto/file.dto';

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
        type: UploadFileResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없습니다.',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: number) {
        return this.fileService.uploadFile(file, userId);
    }

    @Get('download/:fileId')
    @ApiOperation({summary: '파일 다운로드'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '파일 다운로드 성공',
        type: Object,
    })
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
    })
    async downloadFile(@Param('fileId') fileId: number, @Res() res: Response) {
        const fileData = await this.fileService.downloadFile(fileId);
        
        res.set({
            'Content-Type': fileData.contentType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileData.originalName)}"`,
        });
        
        res.send(fileData.buffer);
    }

    @Delete('delete/:fileId')
    @ApiOperation({summary: '파일 삭제'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '파일 삭제 성공',
        type: Object,
    })
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
    })
    async deleteFile(@Param('fileId') fileId: number) {
        return this.fileService.deleteFile(fileId);
    }


    @Get('getAllFile')
    @ApiOperation({summary: '모든 파일 조회'})
    @ApiResponse({
        status: 200,
        description: '모든 파일 조회 성공',
        type: [FileDto],
    })
    async getAllFile() {
        return this.fileService.getAllFile();
    }

    @Get('getFile/:fileId')
    @ApiOperation({summary: '단일 파일 조회'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '단일 파일 조회 성공',
        type: FileDto,
    })
    async getFile(@Param('fileId') fileId: number) {
        return this.fileService.getFile(fileId);
    }

    @Get('getMyFile/:userId')
    @ApiOperation({summary: '내 파일 조회'})
    @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '내 파일 조회 성공',
        type: [FileDto],
    })
    async getMyFile(@Param('userId') userId: number) {
        return this.fileService.getMyFile(userId);
    }
}
