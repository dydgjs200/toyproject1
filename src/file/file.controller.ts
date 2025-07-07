import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, Res, UsePipes, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth, getSchemaPath } from '@nestjs/swagger';
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
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '파일 업로드 성공' },
                data: { $ref: getSchemaPath(UploadFileResponseDto) },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '파일이 첨부되어야 합니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 400 },
                description: { type: 'string', example: '파일이 첨부되어야 합니다.' },
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
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                description: { type: 'string', example: '사용자를 찾을 수 없습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: number, @Request() req) {
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
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '파일 다운로드 성공' },
                data: { type: 'object' },
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
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                description: { type: 'string', example: '파일을 찾을 수 없습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
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
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '파일 삭제 성공' },
                data: { type: 'object' },
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
    @ApiResponse({
        status: 403,
        description: '자신의 파일만 삭제할 수 있습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 403 },
                description: { type: 'string', example: '자신의 파일만 삭제할 수 있습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                description: { type: 'string', example: '파일을 찾을 수 없습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    async deleteFile(@Param('fileId') fileId: number, @Request() req) {
        // 파일 정보 조회
        const file = await this.fileService.getFile(fileId);
        
        // 토큰의 사용자 ID와 파일의 사용자 ID가 일치하는지 확인
        if (req.user.sub !== file.userId) {
            throw new UnauthorizedException('자신의 파일만 삭제할 수 있습니다.');
        }
        
        return this.fileService.deleteFile(fileId);
    }

    @Get('getAllFile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '모든 파일 조회'})
    @ApiResponse({
        status: 200,
        description: '모든 파일 조회 성공',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '모든 파일 조회 성공' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(FileDto) }
                },
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
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '단일 파일 조회 성공' },
                data: { $ref: getSchemaPath(FileDto) },
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
    @ApiResponse({
        status: 403,
        description: '자신의 파일만 조회할 수 있습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 403 },
                description: { type: 'string', example: '자신의 파일만 조회할 수 있습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '파일을 찾을 수 없습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                description: { type: 'string', example: '파일을 찾을 수 없습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    async getFile(@Param('fileId') fileId: number, @Request() req) {
        const file = await this.fileService.getFile(fileId);
        
        // 토큰의 사용자 ID와 파일의 사용자 ID가 일치하는지 확인
        if (req.user.sub !== file.userId) {
            throw new UnauthorizedException('자신의 파일만 조회할 수 있습니다.');
        }
        
        return file;
    }

    @Get('getMyFile/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: '내 파일 조회'})
    @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '내 파일 조회 성공',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 200 },
                description: { type: 'string', example: '내 파일 조회 성공' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(FileDto) }
                },
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
    @ApiResponse({
        status: 403,
        description: '자신의 파일만 조회할 수 있습니다.',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 403 },
                description: { type: 'string', example: '자신의 파일만 조회할 수 있습니다.' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    })
    async getMyFile(@Param('userId') userId: number, @Request() req) {
        // 토큰의 사용자 ID와 요청의 사용자 ID가 일치하는지 확인
        if (req.user.sub.toString() !== userId.toString()) {
            throw new UnauthorizedException('자신의 파일만 조회할 수 있습니다.');
        }
        return this.fileService.getMyFile(userId);
    }
}
