// src/app/auth/admin.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import your auth service

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser(); // Get the current user details

    // Check if the user is an admin or root admin
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'root')) {
      return true; // Allow access if user is an admin or root admin
    }

    // Redirect to main dashboard if the user is not authorized
    this.router.navigate(['/main-dashboard']);
    return false; // Block access if the user is not an admin or root admin
  }
}
