import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'mocked.jwt.token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post on login', () => {
    const mockResponse = { access_token: 'fake-jwt-token' };
    service.login('user', 'pass').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'user', password: 'pass' });

    req.flush(mockResponse);
  });

  it('should store token in localStorage on setToken', () => {
    service.setToken(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should retrieve token from localStorage on getToken', () => {
    localStorage.setItem('token', mockToken);
    expect(service.getToken()).toBe(mockToken);
  });

  it('should remove token from localStorage on logout', () => {
    localStorage.setItem('token', mockToken);
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return true if token is present (isLoggedIn)', () => {
    localStorage.setItem('token', mockToken);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if token is not present (isLoggedIn)', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('getUserRole', () => {
    it('should return null if no token is present', () => {
      localStorage.removeItem('token');
      expect(service.getUserRole()).toBeNull();
    });

    it('should return role if token is valid', () => {
      // Simula um payload com "role": "admin"
      const fakePayload = btoa(JSON.stringify({ role: 'admin' }));
      const fakeJwt = `header.${fakePayload}.signature`;
      localStorage.setItem('token', fakeJwt);

      expect(service.getUserRole()).toBe('admin');
    });

    it('should handle invalid token gracefully', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(service.getUserRole()).toBeNull();
    });
  });

  describe('getUserName', () => {
    it('should return null if no token is present', () => {
      localStorage.removeItem('token');
      expect(service.getUserName()).toBeNull();
    });

    it('should return username if token is valid', () => {
      // Simula um payload com "username": "testuser"
      const fakePayload = btoa(JSON.stringify({ username: 'testuser' }));
      const fakeJwt = `header.${fakePayload}.signature`;
      localStorage.setItem('token', fakeJwt);

      expect(service.getUserName()).toBe('testuser');
    });

    it('should handle invalid token gracefully', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(service.getUserName()).toBeNull();
    });
  });
});
