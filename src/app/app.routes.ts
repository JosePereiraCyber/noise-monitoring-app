import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { StatisticsDashboardComponent } from './pages/statistics-dashboard/statistics-dashboard.component';
import { AlertsDashboardComponent } from './pages/alerts-dashboard/alerts-dashboard.component';
import { CirclesPage } from './pages/circles/circles.page';
import { LoginComponent } from './pages/login/login.component';
import { SecureApiPage } from './pages/secure-api/secure-api.component';
import { AuthGuard } from './auth.guard'; // Importe o guard
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component'; // Import User Management Component
import { LogsViewComponent } from './components/logs-view/logs-view.component';

export const routes: Routes = [

  { path: 'user-management', component: UserManagementComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Rota padrão redireciona para o login
  { path: 'login', component: LoginComponent }, // Rota de login
  { 
    path: 'main-dashboard', 
    component: MainDashboardComponent, 
    canActivate: [AuthGuard] // Protege a rota com authGuard
  },
  { 
    path: 'secure-api', 
    component: SecureApiPage, 
    canActivate: [AuthGuard] // Protege a rota com authGuard
  },
  { 
    path: 'circles', 
    component: CirclesPage, 
    canActivate: [AuthGuard] // Protege a rota com authGuard
  },
  { 
    path: 'statistics', 
    component: StatisticsDashboardComponent, 
    canActivate: [AuthGuard] // Protege a rota com authGuard
  },
  { 
    path: 'alerts', 
    component: AlertsDashboardComponent, 
    canActivate: [AuthGuard] // Protege a rota com authGuard
  },
  { path: 'logs-view', component: LogsViewComponent, canActivate: [AuthGuard] }, // Add this route
  { path: '**', redirectTo: '/login' } // Rota curinga para redirecionar para o login
];