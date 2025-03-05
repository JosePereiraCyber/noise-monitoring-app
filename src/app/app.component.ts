import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { LoginComponent } from './components/login/login.component';  // Import the standalone LoginComponent

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,  // Using standalone component
  imports: [IonApp, IonRouterOutlet, LoginComponent],  // Directly importing the standalone LoginComponent
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class AppComponent {
  title = 'My App';
  constructor() {}
}
