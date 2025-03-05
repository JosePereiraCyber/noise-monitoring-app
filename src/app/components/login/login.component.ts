import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';  // Correct import for Platform from Ionic
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for password hashing
//import { FireDatabaseService } from '@app/services/fireDatabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = ''; // For login form
  password: string = ''; // For login form
  loginError: string = ''; // Error message for login
  isLoading: boolean = false; // Loading state
  showPassword: boolean = false; // Toggle password visibility
  rememberMe: boolean = false; // Remember Me checkbox
  newUser = { name: '', email: '', password: '',role: 'user' }; // For user registration form
  users: any[] = []; // List of users from the database

  constructor(
    private authService: AuthService,
    private router: Router,
    private DatabaseService: DatabaseService,
    //private fireDatabaseService: FireDatabaseService,
    private platform: Platform  // Inject the Platform service from @ionic/angular
  ) {}

  // Handle login
  async login() {
    if (!this.username || !this.password) {
      this.loginError = 'Please enter username and password.';
      return;
    }
  
    this.isLoading = true;
    this.loginError = '';
  
    const isAuthenticated = await this.authService.login(this.username, this.password);
  
    if (isAuthenticated) {
      this.isLoading = false;
      this.router.navigate(['/main-dashboard']);
    } else {
      this.isLoading = false;
      this.loginError = 'Invalid username or password.';
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Initialize the database and load users
  async ngOnInit() {
    if (this.platform.is('pwa')) {  // Use the Platform API from Ionic to check if it's the web platform
      console.log('Web platform detected(PWA). Skipping database initialization.');
      return; // Skip the database initialization on the web
    }

    try {
      // Wait for the database initialization to complete
      const isDbInitialized = await this.DatabaseService.initializeDatabase();
      if (isDbInitialized) {
        console.log('Database initialized successfully!');
        this.loadUsers(); // Load users after initialization
      } else {
        console.error('Database initialization failed!');
        this.loginError = 'Database initialization failed. Please try again.';
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      this.loginError = 'An error occurred during database initialization. Please try again.';
    }
  }

  // Add a new user
  async addNewUser() {
    // Check if the database is initialized
    if (!this.DatabaseService) {
      console.error('Database is not initialized!');
      this.loginError = 'Database is not initialized.';
      return;
    }
  
    // Proceed if form is valid
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.loginError = 'Please fill out all fields.';
      this.isLoading = false;
      return;
    }
  
    this.isLoading = true;
    this.loginError = '';
  
  
    try {
      // Add new user to the database
      const success = await this.DatabaseService.addUser(
        this.newUser.name,
        this.newUser.email,
        this.newUser.password,
        this.newUser.role,
      );
      if (success) {
        this.loadUsers(); // Reload users after adding a new one
        this.newUser = { name: '', email: '', password: '', role: 'user' }; // Reset form and ensure 'admin' is false
        console.log('User added successfully');
      } else {
        this.loginError = 'Failed to add user. Please try again.';
      }
    } catch (error) {
      console.error('Error in addNewUser:', error);
      this.loginError = 'An error occurred while adding the user. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
  
  // Handle forgot password
  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // Load users from the database
  async loadUsers() {
    try {
      this.users = await this.DatabaseService.getUsers();
      console.log('Loaded users:', this.users); // Log the loaded users
    } catch (error) {
      console.error('Error loading users:', error);
      this.loginError = 'Error loading users. Please try again.';
    }
  }

  // Delete a user
  async deleteUser(id: number) {
    const success = await this.DatabaseService.deleteUser(id);
    if (success) {
      this.loadUsers(); // Reload users after deletion
    }
  }
}
