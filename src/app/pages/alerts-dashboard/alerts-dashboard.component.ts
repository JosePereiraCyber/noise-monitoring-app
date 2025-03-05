import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { AlertsComponent } from '../../components/alerts/alerts.component';

@Component({
  selector: 'app-alerts-dashboard',
  standalone: true,
  templateUrl: './alerts-dashboard.component.html',
  styleUrls: ['./alerts-dashboard.component.css'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, AlertsComponent] // Add AlertsComponent
})
export class AlertsDashboardComponent {
  alerts: string[] = [
    'High noise level at 10:00 AM (85 dB)',
    'Medium noise level at 11:30 AM (75 dB)',
    'Low noise level at 12:45 PM (65 dB)',
    'High noise level at 02:00 PM (90 dB)',
    'Medium noise level at 03:15 PM (78 dB)',
    'Low noise level at 04:30 PM (60 dB)'
  ];

  constructor(private location: Location) {}

  // Function to go back
  goBack() {
    this.location.back();
  }
}