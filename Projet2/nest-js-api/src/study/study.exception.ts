import { ApiCodeResponse, ApiException } from '../common/api';

export class StudyCreateException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_CREATE_ERROR, 200);
  }
}

export class StudyNameAlreadyExistsException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_NAME_ALREADY_EXISTS, 200);
  }
}

export class StudyDateRangeInvalidException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_DATE_RANGE_INVALID, 200);
  }
}

export class StudyDeleteException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_DELETE_ERROR, 200);
  }
}

export class StudyNotFoundException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_NOT_FOUND, 200);
  }
}

export class StudyListException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_LIST_ERROR, 200);
  }
}

export class StudyUpdateException extends ApiException {
  constructor() {
    super(ApiCodeResponse.STUDY_UPDATE_ERROR, 200);
  }
}
