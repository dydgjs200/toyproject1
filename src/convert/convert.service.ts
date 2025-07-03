import { Injectable, NotFoundException } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class ConvertService {
    constructor(private readonly fileService: FileService) {}

    async wordToPdf(fileId: number) {
        const file = await this.fileService.getFile(fileId);

        if (!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }
        

        return 'wordToPdf';
    }
}
