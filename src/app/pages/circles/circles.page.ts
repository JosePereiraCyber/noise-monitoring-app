import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { TrafficLightComponent } from '../../components/traffic-light/traffic-light.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-circles',
  standalone: true,
  templateUrl: './circles.page.html',
  styleUrls: ['./circles.page.css'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, TrafficLightComponent] // Add TrafficLightComponent
})
export class CirclesPage {
  activeLight: 'green' | 'yellow' | 'red' = 'green'; // Default active light

  constructor(private location: Location) {} // Inject Location service

  // Simulate real-time updates (for testing)
  ngOnInit() {
    setInterval(() => {
      const lights: ('green' | 'yellow' | 'red')[] = ['green', 'yellow', 'red'];
      const randomLight = lights[Math.floor(Math.random() * lights.length)];
      this.activeLight = randomLight;
      console.log('Active light updated:', this.activeLight); // Log the active light
    }, 3000); // Update every 3 seconds
  }

  // Function to go back
  goBack() {
    this.location.back();
  }
}