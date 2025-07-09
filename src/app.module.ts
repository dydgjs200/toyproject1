import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { S3Module } from './s3/s3.module';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';
import { ConvertModule } from './convert/convert.module';
import { CommonModule } from './common/common.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,   // ms단위 60초
        limit: 10,    // 10번 요청 가능
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true, // 개발 환경에서만 true로 설정
      autoLoadEntities: true,
      charset: 'utf8mb4',
    }),
    UserModule,
    AuthModule,
    FileModule,
    S3Module,
    ConvertModule,
    CommonModule,
  ],
  controllers: [AppController, ConvertController],
  providers: [AppService, ConvertService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }],
})
export class AppModule {}
