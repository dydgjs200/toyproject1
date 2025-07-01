import { Controller, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { Express } from 'express';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}
}
