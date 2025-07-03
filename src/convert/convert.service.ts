import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertService {
    async wordToPdf(fileId: number) {
        return 'wordToPdf';
    }
}
