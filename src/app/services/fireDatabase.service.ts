import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class FireDatabaseService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  // Initialize Firebase (no separate initialization needed)
  async initializeDatabase(): Promise<boolean> {
    console.log('Firebase initialized');
    await this.createRootAdminIfNeeded();
    return true;
  }

  // Create root admin if it doesn't exist
  private async createRootAdminIfNeeded() {
    const rootAdminEmail = 'root@admin.com';
    const rootAdminPassword = CryptoJS.SHA256('rootpassword').toString();

    // Check if root admin already exists
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', rootAdminEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Create root admin user
      const userCredential = await createUserWithEmailAndPassword(this.auth, rootAdminEmail, rootAdminPassword);
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        name: 'Root Admin',
        email: rootAdminEmail,
        password: rootAdminPassword,
        role: 'root',
        isAdmin: true,
      });
      console.log('Root Admin created in Firebase');
    }
  }

  // Add a user
  async addUser(name: string, email: string, password: string, role: string): Promise<boolean> {
    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      // Check if user with the same email already exists
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.error('User with this email already exists');
        return false;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Add user to Firestore
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        name,
        email,
        password: hashedPassword,
        role,
        isAdmin: role === 'admin',
      });

      console.log('User added:', name, email);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  // Update a user
  async updateUser(updatedUser: any): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, 'users', updatedUser.id), {
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        role: updatedUser.role,
        isAdmin: updatedUser.role === 'admin',
      });
      console.log('User updated in Firebase');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Get all users
  async getUsers(): Promise<any[]> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Validate login
  async validateLogin(email: string, password: string): Promise<{ success: boolean; user?: any }> {
    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Fetch user details from Firestore
      const userDoc = await getDocs(query(collection(this.firestore, 'users'), where('email', '==', email)));
      if (!userDoc.empty) {
        const user = userDoc.docs[0].data();
        return { success: true, user: { id: userDoc.docs[0].id, ...user } };
      } else {
        console.log('User not found in Firestore');
        return { success: false };
      }
    } catch (error) {
      console.error('Error validating login:', error);
      return { success: false };
    }
  }

  // Delete a user
  async deleteUser(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.firestore, 'users', id));
      await signOut(this.auth); // Log out the current user
      console.log('User deleted from Firebase');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Update user role
  async editUserRole(user: any, newRole: string): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, 'users', user.id), { role: newRole });
      console.log('User role updated:', user.name);
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Check if the current user is a root admin
  async isRootAdmin(): Promise<boolean> {
    const user = await this.auth.currentUser;
    if (user) {
      const userDoc = await getDocs(query(collection(this.firestore, 'users'), where('uid', '==', user.uid)));
      return userDoc.docs[0]?.data()?.['role'] === 'root';
    }
    return false;
  }

  // Logout the current user
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}