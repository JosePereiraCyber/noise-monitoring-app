import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for password hashing
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private databaseService: DatabaseService) {}


  // Simulates a login request
 async login(username: string, password: string): Promise<boolean> {
  try {
    // Hash the entered password
    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log('Attempting login with', { username, hashedPassword });

    // Fetch all users from the database
    const users = await this.databaseService.getUsers();

    // Find the user by username (email) and check if password matches
    const user = users.find((user: any) => user.email === username && user.password === hashedPassword);

    if (user) {
      console.log('Login successful');

      // Check if the user is the root admin
      const isRootAdmin = user.email === 'rootadmin@example.com';

      // Store authentication token securely
      const authToken = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('your-auth-token'));
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('user', JSON.stringify(user)); // Store user data

      // Store isAdmin and isRootAdmin flags
      sessionStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
      sessionStorage.setItem('isRootAdmin', isRootAdmin ? 'true' : 'false');

      return true;
    } else {
      console.log('Invalid credentials');
      return false;
    }
  } catch (error) {
    console.error('Error in login:', error);
    return false;
  }
}


  // Logs the user out
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAdmin');
    console.log('User logged out');
  }

  // Checks if the user is authenticated (persisted login state)
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  // Checks if the user is an admin
  isAdmin(): boolean {
    return sessionStorage.getItem('isAdmin') === 'true';
  }

  // Register a new user
  async register(newUser: { name: string; email: string; password: string; role: string }): Promise<boolean> {
    try {
      // Check if the user already exists (email)
      const existingUsers = await this.databaseService.getUsers();
      const userExists = existingUsers.some((user: any) => user.email === newUser.email);

      if (userExists) {
        console.log('User already exists');
        return false; // Return false if the user already exists
      }

      // Hash the new user's password with a salt for better security (e.g., use SHA256 + salt)
      const salt = CryptoJS.lib.WordArray.random(128 / 8); // Generate a salt
      const hashedPasswordWithSalt = CryptoJS.SHA256(newUser.password + salt).toString();
      console.log('Registering new user with', { newUser, hashedPasswordWithSalt });

      // Assuming you have a method to save a user to the database
      const success = await this.databaseService.saveUser(newUser.name, newUser.email, hashedPasswordWithSalt, newUser.role);

      if (success) {
        console.log('User registered successfully');
        return true;
      } else {
        console.log('Failed to register user');
        return false;
      }
    } catch (error) {
      console.error('Error in registering user:', error);
      return false;
    }
  }
  async assignAdmin(userId: number, isAdmin: boolean): Promise<boolean> {
    try {
      const user = JSON.parse(sessionStorage.getItem('user')!); // Get the logged-in user from session
      const isRootAdmin = sessionStorage.getItem('isRootAdmin') === 'true';
  
      // Ensure that only root admin can assign admin permissions
      if (!isRootAdmin) {
        console.log('Permission denied: Only root admin can assign admin rights');
        return false;
      }
  
      // Proceed with updating the user's admin status
      const success = await this.databaseService.updateUserAdminStatus(userId, isAdmin);
  
      if (success) {
        console.log('Admin status updated successfully');
        return true;
      } else {
        console.log('Failed to update admin status');
        return false;
      }
    } catch (error) {
      console.error('Error assigning admin rights:', error);
      return false;
    }
  }
  getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser'); // Retrieve user data from storage
    return currentUser ? JSON.parse(currentUser) : null; // Parse it into an object if it exists
  }
  getCurrentUserRole(): string {
    const currentUser = this.getCurrentUser();
    return currentUser?.role || 'user';  // Return 'user' as the default role if none is found
  }
}
