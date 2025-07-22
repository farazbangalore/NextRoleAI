import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { ApplicationComponent } from './application-component/application-component';
import { ApplicationLandingComponent } from './application-landing-component/application-landing-component';
import { UserDetailsComponent } from './user-details-component/user-details-component';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { AuthCallbackComponent } from './auth-callback-component/auth-callback-component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'applications-home', component: ApplicationLandingComponent },
    { path: 'application/add', component: ApplicationComponent },
    { path: 'application/:id', component: ApplicationComponent },
    { path: 'user-details', component: UserDetailsComponent },
    { path: 'auth/callback', component: AuthCallbackComponent },
];
