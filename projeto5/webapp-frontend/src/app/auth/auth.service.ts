// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${BASE_URL}/login`, { username, password });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Método para obter a role do usuário (já existente)
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadString = atob(payloadBase64);
      const payloadObj = JSON.parse(payloadString);
      return payloadObj.role; // Certifique-se que o payload contenha 'role'
    } catch (e) {
      return null;
    }
  }

  // Novo método para obter o nome do usuário
  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadString = atob(payloadBase64);
      const payloadObj = JSON.parse(payloadString);
      return payloadObj.username; // Ajuste conforme a propriedade presente no seu token
    } catch (e) {
      return null;
    }
  }
}
