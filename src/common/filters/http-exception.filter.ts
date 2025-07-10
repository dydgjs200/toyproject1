import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// 예외 처리 시, filter를 통해 응답 형식을 지정
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse()

    let message = ''

    // 컨트롤러에서 지정된 예외가 있을 시 리턴
    // 없다면 지정된 discription 리턴
    // new ValidationPipe 사용 시 message가 배열로 리턴되므로 처리 (ex. login)
    if (exceptionResponse["message"] !== null){
      if (exceptionResponse["message"].length !== 1){
        message = exceptionResponse["message"]
      }
      else{
        message = exceptionResponse["message"][0]
      }
    }else{
      message = this.getDescription(status)
    }
    

    response.status(status).json({
      status: status,
      description: message,
      timestamp: new Date().toISOString(),
    });
  }


  // 응답 형식 지정
  private getDescription(status: number) {
    const descriptions: { [key: number]: string } = {
      200: '요청이 성공적으로 처리되었습니다.',
      201: '리소스가 성공적으로 생성되었습니다.',
      204: '요청이 성공적으로 처리되었습니다.',
      400: '잘못된 요청입니다.',
      401: '인증이 필요합니다.',
      403: '접근 권한이 없습니다.',
      404: '요청한 리소스를 찾을 수 없습니다.',
      409: '리소스 충돌이 발생했습니다.',
      429: 'API 호출 횟수가 너무 많습니다.',
      500: '서버 내부 오류가 발생했습니다.',
    };
  
    return descriptions[status] || '알 수 없는 오류가 발생했습니다.';
  }
}



