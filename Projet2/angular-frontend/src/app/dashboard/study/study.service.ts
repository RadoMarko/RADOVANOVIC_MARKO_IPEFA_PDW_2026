import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../security/model';
import { Study, StudyCreatePayload, StudyUpdatePayload } from './model';

@Injectable({ providedIn: 'root' })
export class StudyService {
  private readonly baseUrl = 'http://localhost:3000/api/study';

  constructor(private readonly http: HttpClient) {}

  create(payload: StudyCreatePayload) {
    return this.http.post<ApiResponse<Study>>(`${this.baseUrl}/create`, payload);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${id}`);
  }

  detail(id: string) {
    return this.http.get<ApiResponse<Study>>(`${this.baseUrl}/detail/${id}`);
  }

  list() {
    return this.http.get<ApiResponse<Study[]>>(`${this.baseUrl}/list`);
  }

  update(payload: StudyUpdatePayload) {
    return this.http.put<ApiResponse<Study>>(`${this.baseUrl}/update`, payload);
  }
}
