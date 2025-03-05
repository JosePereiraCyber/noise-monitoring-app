import { Component, CUSTOM_ELEMENTS_SCHEMA , OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // <-- Import IonicModule
import { DatabaseService } from 'src/app/services/database.service'; // Ensure the path is correct
import { AuthService } from 'src/app/services/auth.service'; // Import AuthService to check for admin role
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true, // <-- Mark the component as standalone
  imports: [IonicModule,CommonModule], // <-- Add IonicModule here
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <-- Add this line
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = []; // Initialize the users array
  isAdmin: boolean = false;  // To check if the current user is an admin

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();  // Check if user is admin
    if (this.isAdmin) {
      this.loadUsers();  // Load users only if the user is an admin
    }
  }

  // Load users (from localStorage or SQLite)
  async loadUsers() {
    try {
      this.users = await this.databaseService.getUsers();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  // Delete a user and update the list
  async deleteUser(userId: number): Promise<void> {
    const success = await this.databaseService.deleteUser(userId);
    if (success) {
      console.log('User deleted successfully');
      // Optionally, reload the users list
      this.loadUsers();
    } else {
      console.error('Error deleting user');
    }
  }

}
