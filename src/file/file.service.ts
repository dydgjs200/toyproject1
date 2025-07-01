import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FileService {
    constructor(private readonly s3Service: S3Service, private readonly userService: UserService) {}

    async uploadFile(file: Express.Multer.File, userId: number) {
        // 사용자 확인
        const user = await this.userService.findOne(userId);
        if (!user) throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');

        // 한글 파일명 인코딩
        const encodedOriginalName = encodeURIComponent(file.originalname);

        // S3 Key를 user_{id} 폴더로 지정
        const fileKey = `uploads/user_${userId}/${uuidv4()}_${encodedOriginalName}`;

        // S3 업로드
        const s3Client = this.s3Service.createS3Client();
        const s3Config = this.s3Service.getS3Config();
        const s3Url = this.s3Service.generateS3Url(fileKey);

        await s3Client.send(new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: fileKey,
            Body: file.buffer,
        }));

        return {
            message: '파일 업로드 성공',
            file: {
                key: fileKey,
                url: s3Url,
                originalName: file.originalname,
            },
        };
    }

    async deleteFile(fileKey: string) {
        const s3Client = this.s3Service.createS3Client();
    }

    async getAllFile(fileKey: string) {
    }
}
