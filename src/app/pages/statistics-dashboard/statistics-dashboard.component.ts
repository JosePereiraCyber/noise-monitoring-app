import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Location } from '@angular/common'; // Import Location service

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.css'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons] // Add IonButtons
})
export class StatisticsDashboardComponent implements OnInit {
  noiseChart: any;

  constructor(private location: Location) {} // Inject Location service

  ngOnInit() {
    Chart.register(...registerables);
    this.noiseChart = new Chart('noiseChart', {
      type: 'line',
      data: {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
        datasets: [{
          label: 'Noise Level (dB)',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Function to go back
  goBack() {
    this.location.back();
  }
}