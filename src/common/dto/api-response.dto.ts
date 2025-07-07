import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  status: number;

  @ApiProperty({ example: '요청이 성공적으로 처리되었습니다.', description: '응답 메시지' })
  description: string;

  @ApiProperty({ description: '응답 데이터' })
  data: T;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '응답 시간' })
  timestamp: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP 상태 코드' })
  status: number;

  @ApiProperty({ example: '잘못된 요청입니다.', description: '에러 메시지' })
  description: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '응답 시간' })
  timestamp: string;
} 