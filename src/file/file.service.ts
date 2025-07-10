import { ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { File } from './entities/file.entity';
import {FileDeleteException, FileNotFoundException} from './file.exception'
import {UserNotFoundException} from '../user/user.exception'
import {S3FileNotFoundException} from '../s3/s3.exception'

@Injectable()
export class FileService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly userService: UserService,
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    private readonly logger = new Logger(FileService.name, {timestamp: true});

    async uploadFile(file: Express.Multer.File, userId: number) {

        const uuid = uuidv4();
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const extension = originalName.split('.').pop();

        // 사용자 확인
        const user = await this.userService.findOne(userId);

        if(!user){
            this.logger.error('해당 사용자를 찾을 수 없습니다')
            throw new UserNotFoundException();
        }

        this.logger.log(`file Upload 사용자 확인 완료`);

        // S3 업로드
        const s3Key = `uploads/user_${userId}/${uuid}.${extension}`;
        const s3Url = this.s3Service.generateS3Url(s3Key);
        const s3Client = this.s3Service.createS3Client();
        const s3Config = this.s3Service.getS3Config();

        await s3Client.send(new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: s3Key,
            Body: file.buffer,
        }));


        // DB 저장
        const fileEntity = this.fileRepository.create({
            uuid,
            originalName,
            s3Key,
            s3Url,
            userId,
        });
        const savedFile = await this.fileRepository.save(fileEntity);

        return { 
            message: '업로드 성공', 
            fileId: savedFile.fileId,
            url: s3Url, 
            uuid: savedFile.uuid
        };
    }

    async downloadFile(fileId: number) {
        // DB에서 파일 정보 조회
        const file = await this.fileRepository.findOne({ where: { fileId } });
        if (!file) {
            this.logger.error('파일을 찾을 수 없습니다.')
            throw new FileNotFoundException()
        }

        // S3에서 파일 다운로드
        const s3Client = this.s3Service.createS3Client();
        const s3Config = this.s3Service.getS3Config();

        const command = new GetObjectCommand({
            Bucket: s3Config.bucketName,
            Key: file.s3Key,
        });

        const result = await s3Client.send(command);
        
        if (!result.Body) {
            this.logger.error('S3에서 파일을 찾을 수 없습니다.')
            throw new S3FileNotFoundException();
        }

        // 파일 스트림을 버퍼로 변환
        const chunks: Buffer[] = [];
        for await (const chunk of result.Body as any) {
            chunks.push(Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);

        return {
            buffer,
            originalName: file.originalName,
            contentType: result.ContentType || 'application/octet-stream',
        };
    }

    async deleteFile(fileId: number) {
        // DB에서 파일 정보 조회
        const file = await this.fileRepository.findOne({ where: { fileId } });

        console.log("delete file > ", file)

        if (!file) {
            this.logger.error('파일을 찾을 수 없습니다.')
            throw new FileNotFoundException()
        }

        // 시행자와 소유자가 다르면 삭제 불가
        if (false) {
            this.logger.error('파일 삭제에 실패했습니다.')
            throw new FileDeleteException()
        }

        // S3에서 파일 삭제
        const s3Client = this.s3Service.createS3Client();
        const s3Config = this.s3Service.getS3Config();

        await s3Client.send(new DeleteObjectCommand({
            Bucket: s3Config.bucketName,
            Key: file.s3Key,
        }));

        // DB에서 파일 정보 삭제
        await this.fileRepository.remove(file);

        return { message: '파일 삭제 성공' };
    }

    async getAllFile(): Promise<{ fileId: number; url: string; originalName: string; userId: number; createdAt: Date }[]> {
        // DB에서 모든 파일 정보 조회
        const files = await this.fileRepository.find({
            order: { createdAt: 'DESC' }
        });

        console.log("get all file > ", files)

        return files.map(file => ({
            fileId: file.fileId,
            url: file.s3Url,
            originalName: file.originalName,
            userId: file.userId,
            createdAt: file.createdAt,
        }));
    }

    async getFile(fileId: number) {
        const file = await this.fileRepository.findOne({ where: { fileId } });
        if (!file) {
            this.logger.error('파일을 찾을 수 없습니다.')
            throw new FileNotFoundException();
        }
        return file;
    }

    async getMyFile(userId: number) {
        const files = await this.fileRepository.find({ where: { userId } });
        if (!files) {
            this.logger.error('파일을 찾을 수 없습니다.')
            throw new FileNotFoundException()
        }
        return files;
    }

    async uploadPdfBufferToS3(pdfBuffer: Buffer, originalName: string, userId: number) {
        const uuid = uuidv4();
        const extension = originalName.split('.').pop();
        const s3Key = `uploads/user_${userId}/${uuid}.${extension}`;
        const s3Client = this.s3Service.createS3Client();
        const s3Config = this.s3Service.getS3Config();

        // S3 업로드
        await s3Client.send(new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: s3Key,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        }));

        const s3Url = this.s3Service.generateS3Url(s3Key);

        // DB 저장 (file upload와 동일)
        const fileEntity = this.fileRepository.create({
            uuid,
            originalName,
            s3Key,
            s3Url,
            userId,
        });
        const savedFile = await this.fileRepository.save(fileEntity);

        return {
            fileId: savedFile.fileId,
            uuid,
            originalName,
            s3Key,
            s3Url,
            userId,
            createdAt: savedFile.createdAt,
        };
    }
}
