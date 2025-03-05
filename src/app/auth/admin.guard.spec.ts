import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Mock the AuthService
class MockAuthService {
  getCurrentUser() {
    return { role: 'admin' }; // Mocking an admin user. Change this for different tests
  }
}

describe('adminGuard', () => {
  let guard: AdminGuard;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Use RouterTestingModule for routing-related tests
      providers: [
        AdminGuard,
        { provide: AuthService, useClass: MockAuthService }, // Mock AuthService
      ],
    });

    guard = TestBed.inject(AdminGuard);  // Get an instance of the guard
    authService = TestBed.inject(AuthService); // Get the mock AuthService
    router = TestBed.inject(Router); // Get the Router for navigation
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is admin', () => {
    const result = guard.canActivate();  // You can call the method here and assert the result

    expect(result).toBe(true);  // Expect the guard to allow access
  });

  it('should block access if user is not admin', () => {
    // Mock the service to return a non-admin user
    spyOn(authService, 'getCurrentUser').and.returnValue({ role: 'user' });

    const result = guard.canActivate();  // Call the guard

    expect(result).toBe(false);  // Expect the guard to block access
  });
});
