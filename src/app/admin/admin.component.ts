import { Component,CUSTOM_ELEMENTS_SCHEMA , inject, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '@app/services/auth.service';
import { IonicModule } from '@ionic/angular'; // <-- Import IonicModule
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [IonicModule], // <-- Add IonicModule here
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <-- Add this line

})
export class AdminComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;
  loading: boolean = false; // New property for loading state
  loginError: string = '';  // Error message for login

  constructor(private authService: AuthService,
              private location: Location,
              private router: Router,
              private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();  // Check if the user is admin
    if (this.isAdmin) {
      this.loadUsers();  // Load users if the user is an admin
    } else {
      console.log('You are not authorized to view this page');
    }
  }

  async loadUsers() {
    this.loading = true; // Start loading
    try {
      this.users = await this.databaseService.getUsers();
      console.log('Loaded users:', this.users);
      this.loginError = ''; // Clear any previous errors
    } catch (error) {
      console.error('Error loading users:', error);
      this.loginError = 'Error loading users. Please try again.';
    } finally {
      this.loading = false; // Stop loading
    }
  }

  async deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const success = await this.databaseService.deleteUser(id);
        if (success) {
          this.loadUsers();  // Reload the user list after successful deletion
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  goBack() {
    this.location.back();
  }

  manageUsers() {
    console.log('Manage Users clicked');
    this.router.navigate(['/user-management']);
  }

  viewLogs() {
    console.log('View Logs clicked');
    this.router.navigate(['/logs-view']);
  }

  systemSettings() {
    console.log('System Settings clicked');
    this.router.navigate(['/settings']);
  }
}
