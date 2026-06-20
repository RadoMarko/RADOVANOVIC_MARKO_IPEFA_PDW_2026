import { StudyStatus } from './study-status.model';

export interface Study {
  study_id: string;
  name: string;
  code: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  status: StudyStatus;
}

export interface StudyCreatePayload {
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  status: StudyStatus;
}

export interface StudyUpdatePayload extends StudyCreatePayload {
  study_id: string;
}
