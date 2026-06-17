import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  ApiResponse,
  Credential,
  SignInPayload,
  SignupPayload,
  Token,
} from './model';

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
      .pipe(tap((response) => this.storeToken(response.data)));
  }

  signUp(payload: SignupPayload) {
    return this.http
      .post<ApiResponse<Token>>(`${this.baseUrl}/signup`, payload)
      .pipe(tap((response) => this.storeToken(response.data)));
  }

  refresh() {
    return this.http
      .post<ApiResponse<Token>>(`${this.baseUrl}/refresh`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(tap((response) => this.storeToken(response.data)));
  }

  me() {
    return this.http.get<ApiResponse<Credential>>(`${this.baseUrl}/me`).pipe(
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
}
