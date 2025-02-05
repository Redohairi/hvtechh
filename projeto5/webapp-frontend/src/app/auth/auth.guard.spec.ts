// src/app/auth/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: spy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // Espiona o método navigate do Router
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate(null as any, null as any);
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to /login if user is not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate(null as any, null as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
