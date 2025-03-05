import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secure-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secure-api.component.html',
  styleUrls: ['./secure-api.component.scss'],
})
export class SecureApiComponent implements OnInit {
  data: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://your-secure-api.com/data', { withCredentials: true })
      .subscribe({
        next: (response) => this.data = response,
        error: (error) => console.error('Failed to fetch data', error),
      });
  }
}