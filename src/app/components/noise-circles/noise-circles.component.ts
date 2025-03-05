import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common'; // Import NgClass for dynamic class binding

@Component({
  selector: 'app-noise-circles',
  standalone: true,
  templateUrl: './noise-circles.component.html',
  styleUrls: ['./noise-circles.component.css'],
  imports: [NgClass] // Add NgClass to imports
})
export class NoiseCirclesComponent {
  @Input() noiseLevel: 'low' | 'medium' | 'high' = 'low'; // Input property to control the active circle
}