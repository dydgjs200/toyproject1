import { Module } from '@nestjs/common';
import { CloudConvertService } from './cloudconvert.service';
import { CloudConvertController } from './cloudconvert.controller';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [CloudConvertController],
  providers: [CloudConvertService],
})
export class CloudConvertModule {} 