import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class CloudConvertService {
  private readonly API_KEY = process.env.CLOUDCONVERT_API_KEY; // CloudConvert API Key를 입력하세요

  async wordToPdf(buffer: Buffer, filename: string): Promise<Buffer> {
    // 1. Job 생성
    const createJobRes = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'import-my-file': { operation: 'import/upload' },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            input_format: 'docx',
            output_format: 'pdf',
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const jobId = createJobRes.data.data.id;
    const importTask = createJobRes.data.data.tasks.find(t => t.name === 'import-my-file');
    const uploadUrl = importTask.result.form.url;
    const uploadParams = importTask.result.form.parameters;

    // 2. 파일 업로드 (buffer 사용)
    const form = new FormData();
    Object.entries(uploadParams).forEach(([key, value]) => form.append(key, value));
    form.append('file', buffer, { filename });

    await axios.post(uploadUrl, form, { headers: form.getHeaders() });

    // 3. 변환 완료 대기
    let exportTask;
    while (true) {
      const jobRes = await axios.get(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${this.API_KEY}` },
      });
      exportTask = jobRes.data.data.tasks.find(t => t.name === 'export-my-file');
      if (exportTask.status === 'finished') break;
      if (exportTask.status === 'error') throw new BadRequestException('CloudConvert 변환 실패');
      await new Promise(res => setTimeout(res, 2000));
    }

    // 4. PDF 다운로드
    const fileUrl = exportTask.result.files[0].url;
    const pdfRes = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    return Buffer.from(pdfRes.data);
  }

  // S3 URL을 받아 Word→PDF 변환
  async wordUrlToPdf(fileUrl: string): Promise<Buffer> {
    // 1. Job 생성 (import/url)
    const createJobRes = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'import-my-file': {
            operation: 'import/url',
            url: fileUrl,
          },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            input_format: 'docx',
            output_format: 'pdf',
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const jobId = createJobRes.data.data.id;

    // 2. 변환 완료 대기
    let exportTask;
    while (true) {
      const jobRes = await axios.get(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${this.API_KEY}` },
      });
      exportTask = jobRes.data.data.tasks.find(t => t.name === 'export-my-file');
      if (exportTask.status === 'finished') break;
      if (exportTask.status === 'error') throw new BadRequestException('CloudConvert 변환 실패');
      await new Promise(res => setTimeout(res, 2000));
    }

    // 3. PDF 다운로드
    const pdfUrl = exportTask.result.files[0].url;
    const pdfRes = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    return Buffer.from(pdfRes.data);
  }
} 