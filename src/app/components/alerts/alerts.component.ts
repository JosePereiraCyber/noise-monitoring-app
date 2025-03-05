import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-alerts',
  standalone: true,
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  imports: [NgFor, FormsModule], // Add FormsModule to imports
  animations: [
    trigger('alertAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(-20px)'
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateX(20px)'
        }))
      ])
    ])
  ]
})
export class AlertsComponent {
  @Input() alerts: string[] = []; // Input property to receive alerts

  // Filter options
  filterOptions = {
    severity: 'all', // 'all', 'low', 'medium', 'high'
    date: 'all', // 'all', 'today', 'last-week'
    time: 'all' // 'all', 'morning', 'afternoon', 'evening'
  };

  // Function to filter alerts
  filterAlerts() {
    return this.alerts.filter(alert => {
      // Filter by severity
      const severityMatch = this.filterOptions.severity === 'all' || alert.toLowerCase().includes(this.filterOptions.severity);

      // Filter by date (example logic)
      const dateMatch = this.filterOptions.date === 'all' || this.isToday(alert);

      // Filter by time (example logic)
      const timeMatch = this.filterOptions.time === 'all' || this.isMorning(alert);

      return severityMatch && dateMatch && timeMatch;
    });
  }

  // Function to check if an alert is from today
  isToday(alert: string): boolean {
    const today = new Date().toDateString();
    const alertDate = new Date(alert.split('at')[1].trim()).toDateString(); // Extract date from alert
    return alertDate === today;
  }

  // Function to check if an alert is in the morning (6 AM - 12 PM)
  isMorning(alert: string): boolean {
    const time = alert.split('at')[1].trim().split(' ')[0]; // Extract time from alert
    const hour = parseInt(time.split(':')[0], 10);
    return hour >= 6 && hour < 12;
  }

  // Function to clear filters
  clearFilters() {
    this.filterOptions = {
      severity: 'all',
      date: 'all',
      time: 'all'
    };
  }
}