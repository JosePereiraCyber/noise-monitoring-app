import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';  // Import IonicModule

@Component({
  selector: 'app-logs-view',
  templateUrl: './logs-view.component.html',
  styleUrls: ['./logs-view.component.css'],
  standalone: true,  // Mark it as standalone
  imports: [IonicModule],  // Import the IonicModule here
})

export class LogsViewComponent implements OnInit {

  logs: any[] = [];

  constructor(private logService: LogService,private location: Location) { }

  ngOnInit(): void {
    // Fetch the logs from the LogService
    this.logService.getLogs().subscribe(logs => {
      this.logs = logs;
    });
  }
  goBack() {
    this.location.back(); // This method uses Angular's Location service to go back.
  }
  
}
