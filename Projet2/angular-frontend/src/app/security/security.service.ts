import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap, timeout } from 'rxjs';
import { ApiResponse, Credential, SignInPayload, SignupPayload, Token } from './model';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private readonly baseUrl = 'http://localhost:3000/api/account';
  private readonly tokenStorageKey = 'access-token';
  private readonly refreshStorageKey = 'refresh-token';

  readonly connectedUser = signal<Credential | null>(null);

  constructor(private readonly http: HttpClient) {}

  signIn(payload: SignInPayload) {
    return this.http
      .post<ApiResponse<Token>>(`${this.baseUrl}/signin`, payload)
      .pipe(timeout({ first: 15000 }))
      .pipe(tap((response) => this.storeTokenIfValid(response)));
  }

  signUp(payload: SignupPayload) {
    return this.http
      .post<ApiResponse<Token>>(`${this.baseUrl}/signup`, payload)
      .pipe(timeout({ first: 15000 }))
      .pipe(tap((response) => this.storeTokenIfValid(response)));
  }

  refresh() {
    return this.http
      .post<ApiResponse<Token>>(`${this.baseUrl}/refresh`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(timeout({ first: 15000 }))
      .pipe(tap((response) => this.storeTokenIfValid(response)));
  }

  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/change-password`, payload)
      .pipe(timeout({ first: 15000 }));
  }

  me() {
    return this.http.get<ApiResponse<Credential>>(`${this.baseUrl}/me`).pipe(
      timeout({ first: 15000 }),
      tap((response) => {
        this.connectedUser.set(response.data);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.refreshStorageKey);
    this.connectedUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshStorageKey);
  }

  isConnected(): boolean {
    return this.getToken() !== null;
  }

  private storeToken(token: Token): void {
    localStorage.setItem(this.tokenStorageKey, token.token);
    localStorage.setItem(this.refreshStorageKey, token.refreshToken);
    this.connectedUser.set(token.credential);
  }

  private storeTokenIfValid(response: ApiResponse<Token>): void {
    if (response.result) {
      this.storeToken(response.data);
    }
  }
}
