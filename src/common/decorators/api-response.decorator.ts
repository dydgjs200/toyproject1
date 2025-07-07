import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto, ErrorResponseDto } from '../dto/api-response.dto';

export const ApiStandardResponse = <TModel extends Type<any>>(
  status: number,
  description: string,
  model?: TModel,
  isArray = false,
) => {
  const schema = {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          status: { example: status },
          description: { example: description },
          data: model
            ? isArray
              ? {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                }
              : { $ref: getSchemaPath(model) }
            : { type: 'object' },
          timestamp: { example: new Date().toISOString() },
        },
      },
    ],
  };

  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema,
    }),
  );
};

export const ApiStandardErrorResponse = (
  status: number,
  description: string,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDto) },
          {
            properties: {
              status: { example: status },
              description: { example: description },
              timestamp: { example: new Date().toISOString() },
            },
          },
        ],
      },
    }),
  );
}; 