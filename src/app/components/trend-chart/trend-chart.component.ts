import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.css']
})
export class TrendChartComponent {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];

  ngOnInit() {
    Chart.register(...registerables);
    const myChart = new Chart('trendChart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Noise Level',
          data: this.data,
          borderColor: 'blue',
          fill: false
        }]
      }
    });
  }
}