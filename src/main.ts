import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('File Upload Application API')
    .setDescription('파일 업로드 어플리케이션')
    .setVersion('1.0')
    .addTag('users', '사용자 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`애플리케이션이 http://localhost:${process.env.PORT ?? 3000}에서 실행 중입니다.`);
  console.log(
    `Swagger 문서는 http://localhost:${process.env.PORT ?? 3000}/api에서 확인할 수 있습니다.`,
  );
}
bootstrap();
