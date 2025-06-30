import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('사용자 관리 시스템 API 문서')
    .setVersion('1.0')
    .addTag('users', '사용자 관련 API')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`애플리케이션이 http://localhost:${process.env.PORT ?? 3000}에서 실행 중입니다.`);
  console.log(`Swagger 문서는 http://localhost:${process.env.PORT ?? 3000}/api에서 확인할 수 있습니다.`);
}
bootstrap();
