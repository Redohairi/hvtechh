// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ajuste conforme seu endpoint NestJS
const BASE_URL = 'http://localhost:3000/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // Faz POST /auth/login com { username, password }
  login(username: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${BASE_URL}/login`, {
      username,
      password,
    });
  }

  // Armazena token no localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Recupera token do localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token (logout)
  logout(): void {
    localStorage.removeItem('token');
  }

  // Verifica se está logado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decodifica token JWT para extrair a role do usuário
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      // Divide token em 3 partes (header, payload, signature)
      const payloadBase64 = token.split('.')[1];
      const payloadString = atob(payloadBase64);
      const payloadObj = JSON.parse(payloadString);
      return payloadObj.role; // assumindo que o NestJS inclui "role" no payload
    } catch (e) {
      return null;
    }
  }
}
