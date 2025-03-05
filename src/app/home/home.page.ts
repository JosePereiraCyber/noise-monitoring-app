import { Component, OnInit  } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

import { DatabaseService } from '../services/database.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})

export class HomePage implements OnInit {

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    // Initialize database
    this.dbService.initializeDatabase();
  }

  addUser() {
    const name = 'Alice';
    const email = 'alice@example.com';
    const password = 'password';
    
    this.dbService.addUser(name, email,password);
  }

  async getUsers() {
    const users = await this.dbService.getUsers();
    console.log(users);
  }
  
}