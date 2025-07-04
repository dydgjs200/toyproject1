import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, Res, UsePipes, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { FileDto, UploadFileResponseDto } from './dto/file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
        status: 400,
        description: '파일이 첨부되어야 합니다.',
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
    })
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없습니다.',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: number, @Request() req) {
        console.log("토큰 사용자 아이디 >", req.user.sub, typeof req.user.sub)
        console.log("사용자 아이디 >", userId, typeof userId)
        // 토큰의 사용자 ID와 요청의 사용자 ID가 일치하는지 확인
        if (req.user.sub.toString() !== userId.toString()) {
            throw new UnauthorizedException('자신의 파일만 업로드할 수 있습니다.');
        }
        return this.fileService.uploadFile(file, userId);
    }

    @Get('download/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '파일 다운로드'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '파일 다운로드 성공',
        type: Object,
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '파일 삭제'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '파일 삭제 성공',
        type: Object,
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
    })
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
    })
    async deleteFile(@Param('fileId') fileId: number) {
        return this.fileService.deleteFile(fileId);
    }

    @Get('getAllFile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '모든 파일 조회'})
    @ApiResponse({
        status: 200,
        description: '모든 파일 조회 성공',
        type: [FileDto],
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
    })
    async getAllFile() {
        const files = await this.fileService.getAllFile();
        return files.map(file => ({
            fileId: file.fileId,
            s3Url: file.url,
            originalName: file.originalName,
            userId: file.userId,
            createdAt: file.createdAt,
        }));
    }

    @Get('getFile/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '단일 파일 조회'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '단일 파일 조회 성공',
        type: FileDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
    })
    async getFile(@Param('fileId') fileId: number) {
        return this.fileService.getFile(fileId);
    }

    @Get('getMyFile/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '내 파일 조회'})
    @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '내 파일 조회 성공',
        type: [FileDto],
    })
    @ApiResponse({
        status: 401,
        description: '인증이 필요합니다.',
    })
    async getMyFile(@Param('userId') userId: number, @Request() req) {
        // 토큰의 사용자 ID와 요청의 사용자 ID가 일치하는지 확인
        if (req.user.sub.toString() !== userId.toString()) {
            throw new UnauthorizedException('자신의 파일만 조회할 수 있습니다.');
        }
        return this.fileService.getMyFile(userId);
    }
}
