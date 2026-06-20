import { ApiCodeResponse, ApiException } from '../common/api';

export class NoTokenFoundedException extends ApiException {
  constructor() {
    super(ApiCodeResponse.NO_TOKEN_FOUNDED, 401);
  }
}

export class UserNotFoundException extends ApiException {
  constructor() {
    super(ApiCodeResponse.USER_NOT_FOUND, 200);
  }
}

export class TokenExpiredException extends ApiException {
  constructor() {
    super(ApiCodeResponse.TOKEN_EXPIRED, 401);
  }
}

export class SignupException extends ApiException {
  constructor() {
    super(ApiCodeResponse.SIGNUP_ERROR, 200);
  }
}

export class CredentialDeleteException extends ApiException {
  constructor() {
    super(ApiCodeResponse.CREDENTIAL_DELETE_ERROR, 200);
  }
}

export class UserAlreadyExistException extends ApiException {
  constructor() {
    super(ApiCodeResponse.USER_ALREADY_EXIST, 200);
  }
}

export class MailAlreadyExistException extends ApiException {
  constructor() {
    super(ApiCodeResponse.MAIL_ALREADY_EXIST, 200);
  }
}

export class TokenGenerationException extends ApiException {
  constructor() {
    super(ApiCodeResponse.TOKEN_GEN_ERROR, 500);
  }
}

export class PasswordChangeException extends ApiException {
  constructor() {
    super(ApiCodeResponse.PASSWORD_CHANGE_ERROR, 200);
  }
}

export class OldPasswordInvalidException extends ApiException {
  constructor() {
    super(ApiCodeResponse.OLD_PASSWORD_INVALID, 200);
  }
}
