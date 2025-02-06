// src/app/auth/auth.service.stub.ts
import { of } from 'rxjs';

export const authServiceStub = {
  login: (username: string, password: string) => of({ access_token: 'fake-token' }),
  setToken: (token: string) => {},
  getToken: () => 'fake-token',
  logout: () => {},
  isLoggedIn: () => true,        
  getUserRole: () => 'admin',
  getUserName: () => 'Test User'
};
