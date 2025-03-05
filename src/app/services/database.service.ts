import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core'; // Import Capacitor
import { CapacitorSQLite } from '@capacitor-community/sqlite'; // Import SQLite plugin
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  isDatabaseInitialized: boolean = false;
  public db: any = null;
 

  constructor() {
  }
  async updateUser(updatedUser: any): Promise<boolean> {
    try {
      // Ensure the database is initialized
      if (!this.isDatabaseInitialized) {
        console.error('Database is not initialized!');
        return false;
      }
  
      // Update in SQLite or localStorage based on the platform
      if (Capacitor.getPlatform() === 'web') {
        // Update user in localStorage (for web platform)
        let users = this.getUsersFromLocalStorage();
        const index = users.findIndex((user: any) => user.id === updatedUser.id);
        if (index !== -1) {
          users[index] = updatedUser; // Update user properties
          this.setUsersToLocalStorage(users); // Save the updated users list
          console.log('User updated in localStorage');
          return true;
        } else {
          console.error('User not found in localStorage');
          return false;
        }
      } else {
        // Update user in SQLite (for native platforms)
        const query = `UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?`;
        try {
          await this.db.executeSql(query, [
            updatedUser.name,
            updatedUser.email,
            updatedUser.password,
            updatedUser.role, // Ensure isAdmin is stored as 1 or 0
            updatedUser.id,
          ]);
          console.log('User updated in SQLite');
          return true;
        } catch (error) {
          console.error('Error updating user in SQLite:', error);
          return false;
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
  
  // Initialize the database (localStorage on the web or SQLite on native platforms)
  async initializeDatabase(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('SQLite is not supported on the web platform. Using localStorage instead.');
      this.db = localStorage;  // Fallback to localStorage on web
      this.isDatabaseInitialized = true;
      await this.createRootAdminIfNeeded();
      return true;
    }
  
    try {
      const result = await CapacitorSQLite.open({ database: 'my_database.db' });
      this.db = result;
      console.log('Database initialized');
      await this.createTables(); // Ensure tables are created
      await this.createRootAdminIfNeeded(); // Ensure root admin is created
      this.isDatabaseInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      this.db = null;
      return false;
    }
  }

  // Create tables if they don't exist (only for SQLite, will be skipped on the web)
  private async createTables() {
    if (Capacitor.getPlatform() !== 'web') {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          root TEXT NOT NULL,
          isAdmin INTEGER NOT NULL DEFAULT 0  -- Add isAdmin column (0 = false, 1 = true)
        );
      `;
      try {
        const result = await this.db.executeSql(query, []);
        console.log('Table creation result:', result);
      } catch (error) {
        console.error('Error creating tables:', error);
      }
    }
  }
  
  private async createRootAdminIfNeeded() {
    if (Capacitor.getPlatform() === 'web') {
      const users = this.getUsersFromLocalStorage();
      if (users.length === 0) {
        const rootAdmin = {
          id: 1,
          name: 'Root Admin',
          email: 'root@admin.com',
          password: CryptoJS.SHA256('rootpassword').toString(),
          role: 'root',
        };
        users.push(rootAdmin);
        this.setUsersToLocalStorage(users);
        console.log('Root Admin created in localStorage');
      }
    } else {
      const query = `SELECT COUNT(*) AS count FROM users`;
      try {
        const result = await this.db.executeSql(query, []);
        if (result.values[0].count === 0) {
          const rootAdminQuery = `INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)`;
          await this.db.executeSql(rootAdminQuery, [
            'Root Admin',
            'root@admin.com',
            CryptoJS.SHA256('rootpassword').toString(),
            'root',  // Root admin has isAdmin = 1
            1,
          ]);
          console.log('Root Admin created in SQLite');
        }
      } catch (error) {
        console.error('Error checking user count or creating root admin:', error);
      }
    }
  }
  

  // Add a user (hash password before storing)
  async addUser(name: string, email: string, password: string, role: string): Promise<boolean> {
    if (!this.isDatabaseInitialized) {
      console.error('Database is not initialized!');
      return false;
    }
  
    const hashedPassword = CryptoJS.SHA256(password).toString();  // Hash password before storing
  
    if (Capacitor.getPlatform() === 'web') {
      const users = this.getUsersFromLocalStorage();
      const newUser = {
        id: users.length > 0 ? Math.max(users.map((u: { id: any; }) => u.id)) + 1 : 1, // Ensure unique ID for new user
        name,
        email,
        password: hashedPassword,
        role,
      };
  
      users.push(newUser); // Store hashed password
      this.setUsersToLocalStorage(users); // Save users to localStorage
      return true;
    } else {
      // Using SQLite on native platforms
      const query = `INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)`;
      try {
        await this.db.executeSql(query, [name, email, hashedPassword, role, role === 'admin' ? 1 : 0]);  // Set isAdmin based on role
        console.log('User added:', name, email);
        return true;
      } catch (error) {
        console.error('Error adding user:', error);
        return false;
      }
    }
  }
  

  // Save a user (either on localStorage or SQLite)
  async saveUser(name: string, email: string, password: string, role: string): Promise<boolean> {
    if (!this.isDatabaseInitialized) {
      console.error('Database is not initialized!');
      return false;
    }
  
    const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash password before saving
  
    if (Capacitor.getPlatform() === 'web') {  
      const users = this.getUsersFromLocalStorage();
      users.push({ name, email, password: hashedPassword, role });  // Ensure isAdmin is passed
      this.setUsersToLocalStorage(users); // Save users to localStorage
      console.log('User saved to localStorage');
      return true;
    } else {
      const query = `INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)`;
      try {
        await this.db.executeSql(query, [name, email, hashedPassword, role]);  // Store 1 for true, 0 for false
        console.log('User saved to SQLite');
        return true;
      } catch (error) {
        console.error('Error saving user:', error);
        return false;
      }
    }
  }

  // Get all users (either from localStorage or SQLite)
  async getUsers(): Promise<any[]> {
    if (!this.isDatabaseInitialized) {
      console.error('Database is not initialized!');
      return [];
    }

    if (Capacitor.getPlatform() === 'web') {
      // Using localStorage on the web
      return this.getUsersFromLocalStorage();
    } else {
      // Using SQLite on native platforms
      const query = `SELECT * FROM users`;
      try {
        const result = await this.db.executeSql(query, []);
        const users = result.values.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
        }));
        console.log('Fetched users:', users);
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    }
  }

  private setUsersToLocalStorage(users: any[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Get users from localStorage (for web platform)
  getUsersFromLocalStorage() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users;
  }

  // Validate login for Web and Native Platforms
  // Validate login for Web and Native Platforms
async validateLogin(email: string, password: string): Promise<boolean> {
  const hashedPassword = CryptoJS.SHA256(password).toString();
  console.log('Attempting login with:', email, hashedPassword);

  if (Capacitor.getPlatform() === 'web') {
    const users = this.getUsersFromLocalStorage();
    const user = users.find((user: any) => user.email === email && user.password === hashedPassword);
    return user ? true : false;
  } else {
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    try {
      const result = await this.db.executeSql(query, [email, hashedPassword]);
      if (result.rows.length > 0) {
        const user = result.rows.item(0);
        if (user.role === 'root' || user.role === 'admin') {
          console.log('User authenticated with root/admin role');
          return true;
        }
      }
      console.log('Invalid login credentials');
      return false;
    } catch (error) {
      console.error('Error validating login:', error);
      return false;
    }
  }
}


  // Delete a user (either from localStorage or SQLite)
  async deleteUser(id: number): Promise<boolean> {
    if (!this.isDatabaseInitialized) {
      console.error('Database is not initialized!');
      return false;
    }

    if (Capacitor.getPlatform() === 'web') {
      // Using localStorage on the web
      let users = this.getUsersFromLocalStorage();
      users = users.filter((user: any) => user.id !== id);
      this.setUsersToLocalStorage(users);
      return true;
    } else {
      // Using SQLite on native platforms
      const query = `DELETE FROM users WHERE id = ?`;
      try {
        await this.db.executeSql(query, [id]);
        return true;
      } catch (error) {
        console.error('Error deleting user:', error);
        return false;
      }
    }
  }
  async editUserRole(user: any, newRole: string): Promise<boolean> {
    if (!this.isDatabaseInitialized) {
      console.error('Database is not initialized!');
      return false;
    }
    // Ensure the current user is a root admin before allowing role changes
    if (this.isRootAdmin()) {
      const query = `UPDATE users SET role = ? WHERE id = ?`;
      try {
        await this.db.executeSql(query, [newRole, user.id]);
        console.log('User role updated:', user.name);
        return true;
      } catch (error) {
        console.error('Error updating user role:', error);
        return false;
      }
    } else {
      console.error('Only root admins can edit user roles.');
      return false;
    }
  }
  
  
  isRootAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser?.role === 'root';
  }
  

  // Update user admin status
  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<boolean> {
    try {
      if (!this.isDatabaseInitialized) {
        console.error('Database is not initialized!');
        return false;  // Return false if the database is not initialized
      }
  
      // Check platform and update the user's admin status
      if (Capacitor.getPlatform() === 'web') {
        let users = this.getUsersFromLocalStorage();
        const userIndex = users.findIndex((user: any) => user.id === userId);
        if (userIndex !== -1) {
          users[userIndex].isAdmin = isAdmin; // Set the admin flag
          this.setUsersToLocalStorage(users); // Save to localStorage
          console.log('User admin status updated in localStorage');
          return true; // Return true after updating
        } else {
          console.error('User not found in localStorage');
          return false; // Return false if user is not found
        }
      } else {
        // If not on web, assume SQLite is used
        const query = `UPDATE users SET isAdmin = ? WHERE id = ?`;
        await this.db.executeSql(query, [isAdmin ? 1 : 0, userId]);  // 1 for true, 0 for false
        console.log('User admin status updated in SQLite');
        return true; // Return true after updating in database
      }
    } catch (error) {
      console.error('Error updating user admin status:', error);
      return false; // Return false in case of error
    }
  }
  

}
