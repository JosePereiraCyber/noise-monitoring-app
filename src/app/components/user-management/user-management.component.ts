import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';  
import { IonicModule } from '@ionic/angular';  
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor
import { Platform } from '@ionic/angular'; // Import Platform for database initialization

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'root'|'user'|'admin';
  isAdmin?: boolean;  // Add isAdmin property if you want to explicitly toggle it
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  isLoading: boolean = false;
  users: User[] = [];  
  newUser: User = { name: '', email: '', password: '',role: 'user' };
  formSubmitted: boolean = false; // For form validation feedback
  successMessage: string = '';  // Message to display upon successful actions
  errorMessage: string = '';    // Message to display when an error occurs

  constructor(
    private databaseService: DatabaseService,
    private location: Location,
    private platform: Platform // Inject Platform
  ) {}

  async ngOnInit() {
    // Initialize the database
    if (this.platform.is('pwa')) {
      console.log('Web platform detected (PWA). Skipping database initialization.');
    } else {
      try {
        const isDbInitialized = await this.databaseService.initializeDatabase();
        if (isDbInitialized) {
          console.log('Database initialized successfully!');
          await this.loadUsers();
        } else {
          console.error('Database initialization failed!');
        }
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    }
  }

  async loadUsers() {
    console.log('Loading users...');
    try {
      this.users = await this.databaseService.getUsers();
      console.log('Users loaded:', this.users);
      this.successMessage = 'Users loaded successfully!';
      this.errorMessage = '';  // Clear any previous errors
    } catch (error) {
      console.error('Error loading users:', error);
      this.errorMessage = 'Failed to load users. Please try again.';
      this.successMessage = '';
    }
  }

  async addUser() {
    this.formSubmitted = true;
  
    // Validate form fields
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.errorMessage = 'All fields are required!';
      this.successMessage = '';
      return;
    }
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.errorMessage = 'Please provide a valid email address.';
      this.successMessage = '';
      return;
    }
  
    this.isLoading = true;
    const success = await this.databaseService.saveUser(
      this.newUser.name,
      this.newUser.email,
      this.newUser.password,
      this.newUser.role  // Pass valid boolean value
    );
  
    this.isLoading = false;
    if (success) {
      this.successMessage = 'User added successfully!';
      this.errorMessage = '';
      this.newUser = { name: '', email: '', password: '', role: 'user' }; // Reset form
      await this.loadUsers();
    } else {
      this.errorMessage = 'Failed to add user. Please try again.';
      this.successMessage = '';
    }
  }

  async editUser(user: User) {
    // Check if the current user is a root admin
    if (!this.isRootAdmin()) {
      this.errorMessage = 'Only a root admin can change user roles.';
      this.successMessage = '';
      return;
    }
  
    // Toggle admin status, update the role accordingly
    const updatedUser = { 
      ...user, 
      role: user.isAdmin ? 'user' : 'admin' // Map isAdmin boolean to role
    };
  
    const success = await this.databaseService.updateUser(updatedUser);
    if (success) {
      this.successMessage = 'User role updated successfully';
      this.errorMessage = '';
      await this.loadUsers(); // Reload the user list to reflect changes
    } else {
      this.errorMessage = 'Failed to update user role';
      this.successMessage = '';
    }
  }
  
  

  // Helper to check if the current user is a root admin
// Helper to check if the current user is a root admin
isRootAdmin(): boolean {
  // Assuming you have a method in your auth service that provides the current user’s role
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return currentUser?.role === 'root';
}


async deleteUser(id: number) {
  if (id === 1) {
    this.errorMessage = 'Root user cannot be deleted!';
    this.successMessage = '';
    return;
  }

  const confirmed = confirm('Are you sure you want to delete this user?');
  if (!confirmed) return;

  const success = await this.databaseService.deleteUser(id);
  if (success) {
    this.successMessage = 'User deleted successfully';
    this.errorMessage = '';
    await this.loadUsers(); // Reload users after deletion
  } else {
    this.errorMessage = 'Failed to delete user. Please try again.';
    this.successMessage = '';
  }
}
  

  goBack() {
    this.location.back();
  }
}
