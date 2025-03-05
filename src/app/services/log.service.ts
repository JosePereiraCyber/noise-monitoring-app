import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  
  constructor() { }

  // Mock method to get logs
  getLogs(): Observable<Log[]> {
    // For now, returning mock logs
    return of([
      { timestamp: '2025-02-21 12:30', level: 'INFO', message: 'User logged in' },
      { timestamp: '2025-02-21 12:35', level: 'ERROR', message: 'Failed to connect to database' },
      { timestamp: '2025-02-21 12:40', level: 'WARNING', message: 'Memory usage is high' }
    ]);
  }
}
