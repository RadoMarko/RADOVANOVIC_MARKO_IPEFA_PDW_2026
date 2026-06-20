import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { isNil } from 'lodash';
import { ApiCodeResponse } from './api-code-response.enum';

export class ApiException extends HttpException {
  constructor(code: ApiCodeResponse, status: number, data: any = null) {
    super(
      {
        code,
        data,
        result: false,
      },
      status,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        code: ApiCodeResponse.PAYLOAD_IS_NOT_VALID,
        data: errors.map((e) => validationErrorToApiCodeResponse(e)).flat(),
        result: false,
      },
      499,
    );
  }
}

export const validationErrorToApiCodeResponse = (
  error: ValidationError,
): string[] => {
  if (isNil(error.constraints)) {
    return [ApiCodeResponse.PAYLOAD_PARAM_IS_MISSING];
  }

  const customMessages = Object.values(error.constraints).filter((message) =>
    Object.values(ApiCodeResponse).includes(message as ApiCodeResponse),
  );

  if (customMessages.length > 0) {
    return customMessages;
  }

  return Object.keys(error.constraints).map((key: string) => {
    const code =
      ApiCodeResponse[
        `${camelToSnake(error.property)}_${camelToSnake(
          key,
        )}` as keyof typeof ApiCodeResponse
      ];

    return isNil(code) ? ApiCodeResponse.PAYLOAD_PARAM_IS_MISSING : code;
  });
};

export const camelToSnake = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .join('_')
    .toUpperCase();
};
