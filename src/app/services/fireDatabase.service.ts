import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FireDatabaseService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  async initializeDatabase(): Promise<boolean> {
    console.log('Firebase initialized');
    await this.createRootAdminIfNeeded();
    return true;
  }

  private async createRootAdminIfNeeded() {
    const rootAdminEmail = 'root@admin.com';
    const rootAdminPassword = 'rootpassword';

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', rootAdminEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const userCredential = await createUserWithEmailAndPassword(this.auth, rootAdminEmail, rootAdminPassword);
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        name: 'Root Admin',
        email: rootAdminEmail,
        role: 'root',
        isAdmin: true,
      });
      console.log('Root Admin created in Firebase');
    }
  }

  async addUser(name: string, email: string, password: string, role: string): Promise<boolean> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.error('User with this email already exists');
        return false;
      }

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        name,
        email,
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

  async updateUser(updatedUser: User): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, 'users', updatedUser.id!), {
        name: updatedUser.name,
        email: updatedUser.email,
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

  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async validateLogin(email: string, password: string): Promise<{ success: boolean; user?: User }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userDoc = await getDocs(query(collection(this.firestore, 'users'), where('email', '==', email)));
      if (!userDoc.empty) {
        const user = userDoc.docs[0].data();
        return { success: true, user: { id: userDoc.docs[0].id, ...user } as User };
      } else {
        console.log('User not found in Firestore');
        return { success: false };
      }
    } catch (error) {
      console.error('Error validating login:', error);
      return { success: false };
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.firestore, 'users', id));
      await signOut(this.auth);
      console.log('User deleted from Firebase');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async editUserRole(user: User, newRole: string): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, 'users', user.id!), { role: newRole });
      console.log('User role updated:', user.name);
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  async isRootAdmin(): Promise<boolean> {
    const user = await this.auth.currentUser;
    if (user) {
      const userDoc = await getDocs(query(collection(this.firestore, 'users'), where('uid', '==', user.uid)));
      return userDoc.docs[0]?.data()?.['role'] === 'root';
    }
    return false;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}