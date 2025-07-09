import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { UploadFileResponseDto, FileDto } from './file/dto/file.dto';
import { PdfUploadResponseDto } from './file/dto/pdf-upload-response.dto';
import { LoginDto } from './auth/dto/auth.dto';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { User } from './user/entities/user.entity';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

// .env 파일 로드
dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('File Upload Application API')
    .setDescription('파일 업로드 어플리케이션')
    .setVersion('1.0')
    .addTag('users', '사용자 관련 API')
    .addBearerAuth()
    .build();

  // swagger token 유지 설정
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  // 예외 처리 시, filter를 통해 응답 형식을 지정
  app.useGlobalFilters(new HttpExceptionFilter());

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      UploadFileResponseDto, 
      FileDto, 
      PdfUploadResponseDto,
      LoginDto,
      CreateUserDto,
      UpdateUserDto,
      User
    ],
  });
  SwaggerModule.setup('api', app, document, customOptions);

  // 전역 validation pipe 설정
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`애플리케이션이 http://localhost:${process.env.PORT ?? 3000}에서 실행 중입니다.`);
  console.log(
    `Swagger 문서는 http://localhost:${process.env.PORT ?? 3000}/api에서 확인할 수 있습니다.`,
  );
}
bootstrap();
