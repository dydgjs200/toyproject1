import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number;
  description: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = response.statusCode;

    return next.handle().pipe(
      map(data => ({
        status,
        description: this.getDescription(status),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getDescription(status: number): string {
    const descriptions: { [key: number]: string } = {
      200: '요청이 성공적으로 처리되었습니다.',
      201: '리소스가 성공적으로 생성되었습니다.',
      204: '요청이 성공적으로 처리되었습니다.',
      400: '잘못된 요청입니다.',
      401: '인증이 필요합니다.',
      403: '접근 권한이 없습니다.',
      404: '요청한 리소스를 찾을 수 없습니다.',
      409: '리소스 충돌이 발생했습니다.',
      500: '서버 내부 오류가 발생했습니다.',
    };

    return descriptions[status] || '요청이 처리되었습니다.';
  }
} 