import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { ApplicationComponent } from './application-component/application-component';
import { ApplicationLandingComponent } from './application-landing-component/application-landing-component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'applications', component: ApplicationLandingComponent },
    { path: 'add-application', component: ApplicationComponent },
];
