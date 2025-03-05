import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-test-circles',
  standalone: true,
  template: `
    <div class="circles-container">
      <div class="circle green" [ngClass]="{'active': true}"></div>
      <div class="circle yellow" [ngClass]="{'active': false}"></div>
      <div class="circle red" [ngClass]="{'active': false}"></div>
    </div>
  `,
  styles: [`
    .circles-container {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 20px;
    }

    .circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0.3;
      transition: opacity 0.3s ease;
      border: 2px solid black; /* Temporary border for debugging */
    }

    .green {
      background-color: green;
    }

    .yellow {
      background-color: yellow;
    }

    .red {
      background-color: red;
    }

    .active {
      opacity: 1;
    }
  `],
  imports: [NgClass]
})
export class TestCirclesComponent {}