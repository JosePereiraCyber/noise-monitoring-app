import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-traffic-light',
  standalone: true,
  template: `
    <div class="traffic-light">
      <div class="light green" [class.active]="activeLight === 'green'"></div>
      <div class="light yellow" [class.active]="activeLight === 'yellow'"></div>
      <div class="light red" [class.active]="activeLight === 'red'"></div>
    </div>
  `,
  styles: [`
    .traffic-light {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      background-color: #444;
      border-radius: 20px;
      width: 120px;
      margin: 20px auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    
    .light {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      opacity: 0.3;
      transition: opacity 0.3s ease, transform 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .light.active {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .green {
      background: linear-gradient(145deg, #00c853, #00e676);
    }
    
    .yellow {
      background: linear-gradient(145deg, #ffd600, #ffea00);
    }
    
    .red {
      background: linear-gradient(145deg, #d50000, #ff1744);
    }
  `]
})
export class TrafficLightComponent {
  @Input() activeLight: 'green' | 'yellow' | 'red' = 'green';
}