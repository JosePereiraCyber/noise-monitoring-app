import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {
    // Initialize storage
    this.init();
  }

  // Initialize storage
  private async init() {
    await this.storage.create();
  }

  // Store data
  async setItem(key: string, value: any) {
    try {
      await this.storage.set(key, value);
      console.log(`Stored ${key}:`, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  // Get data
  async getItem(key: string) {
    try {
      const value = await this.storage.get(key);
      console.log(`Fetched ${key}:`, value);
      return value;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  // Remove data
  async removeItem(key: string) {
    try {
      await this.storage.remove(key);
      console.log(`Removed ${key}`);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  // Clear all data
  async clear() {
    try {
      await this.storage.clear();
      console.log('Storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
