import { Component } from '@angular/core';
import { AdminDashboardComponent } from '../../pages/admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons // Import IonButtons
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, // Add IonButtons here
    RouterLink,
    AdminDashboardComponent, 
  ],
  animations: [
    trigger('buttonAnimation', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hover', style({
        transform: 'scale(1.1)'
      })),
      transition('normal <=> hover', animate('200ms ease-in-out'))
    ])
  ]
})
export class MainDashboardComponent {
  buttonState = 'normal'; // State for button animation
  isAdmin: boolean = localStorage.getItem('isAdmin') === 'true';  // Check if the user is admin

  constructor(private authService: AuthService, private router: Router) {}

  // Function to change button state on hover
  onButtonHover(isHovered: boolean) {
    this.buttonState = isHovered ? 'hover' : 'normal';
  }

  // Function to handle logout
  logout() {
    this.authService.logout(); // Call the logout method in AuthService
    this.router.navigate(['/login']); // Redirect to the login page
  }

}