import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from '../auth.interceptor';
import { AuthService } from '../auth.service';

describe('AuthInterceptor (functional)', () => {
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let injector: Injector;

  beforeEach(() => {
    fakeAuthService = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: fakeAuthService }]
    });
    // Precisamos do Injector pra usar runInInjectionContext:
    injector = TestBed.inject(Injector);
  });

  it('should add Authorization header when token exists', (done) => {
    fakeAuthService.getToken.and.returnValue('fake-token');
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Bearer fake-token');
      return of(new HttpResponse({ status: 200 }));
    };

    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(response => {
        expect(response).toBeTruthy();
        done();
      });
    });
  });

  it('should not add Authorization header when token is null', (done) => {
    fakeAuthService.getToken.and.returnValue(null);
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 }));
    };

    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(response => {
        expect(response).toBeTruthy();
        done();
      });
    });
  });
});
