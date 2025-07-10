import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, Res, UsePipes, UseGuards, Request, UnauthorizedException, ParseFilePipe, MaxFileSizeValidator, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'express';
import { FileDto, UploadFileResponseDto } from './dto/file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {UserService} from '../user/user.service';
import {FileDeleteException, FileNotFoundException} from '../file/file.exception';
import {UserNotFoundException} from '../user/user.exception'
import {S3FileNotFoundException} from '../s3/s3.exception'

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService, private readonly userService: UserService) {}
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
                    description: '업로드 파일'
                },
                userId:{
                    type: 'integer',
                    description: '유저 ID',
                    example: 1
                }
            },
            required: ['file', 'userId']
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }), // 파일 검증 및 100MB 제한
        ],
    })) file: Express.Multer.File, @Body('userId', ParseIntPipe) userId: number, @Request() req) {
        try{
            return this.fileService.uploadFile(file, userId);
        }catch(error){
            if(error instanceof UserNotFoundException)
                throw new NotFoundException(error.message)
        }
    }

    @Get('download/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '파일 다운로드'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    async downloadFile(@Param('fileId', ParseIntPipe) fileId: number, @Res() res: Response) {
        try{
            const fileData = await this.fileService.downloadFile(fileId);
        
            res.set({
                'Content-Type': fileData.contentType,
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileData.originalName)}"`,
            });
            
            res.send(fileData.buffer);
        }catch(error){
            if (error instanceof FileNotFoundException)
                throw new NotFoundException(error.message)
            if (error instanceof S3FileNotFoundException)
                throw new NotFoundException(error.message)
        }
    }

    @Get('download-info/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '파일 다운로드 정보 조회'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    async getDownloadInfo(@Param('fileId', ParseIntPipe) fileId: number, @Request() req) {
        // 파일 정보 조회
        const file = await this.fileService.getFile(fileId);

        // 파일 다운로드 정보 반환
        return {
            fileId: file.fileId,
            originalName: file.originalName,
            contentType: this.getContentType(file.originalName),
            downloadUrl: `/file/download/${fileId}`,
            fileSize: 0 // 실제 파일 크기는 S3에서 조회해야 함
        };
    }

    private getContentType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();
        const contentTypes: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'txt': 'text/plain',
            'json': 'application/json',
            'xml': 'application/xml',
            'csv': 'text/csv',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel'
        };
        return contentTypes[extension || ''] || 'application/octet-stream';
    }

    @Delete('delete/:fileId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '파일 삭제'})
    @ApiParam({ name: 'fileId', description: '파일 ID', example: 1 })
    async deleteFile(@Param('fileId', ParseIntPipe) fileId: number, @Request() req) {
        try{
            return this.fileService.deleteFile(fileId);
        }catch(error){
            if(error instanceof FileNotFoundException){
                throw new NotFoundException(error.message)
            }
        }
        
    }

    @Get('getAllFile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '모든 파일 조회'})
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
    async getFile(@Param('fileId', ParseIntPipe) fileId: number, @Request() req) {
        try{
            const file = await this.fileService.getFile(fileId);
        
            return file;
        }catch(error){
            
        }
    }

    @Get('getMyFile/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '내 파일 조회'})
    @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
    async getMyFile(@Param('userId', ParseIntPipe) userId: number, @Request() req) {
        try{
            const myFile = await this.fileService.getMyFile(userId)

            return this.fileService.getMyFile(userId);
        }catch(error){

        }
    }
}
