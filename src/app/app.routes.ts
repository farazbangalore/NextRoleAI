import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { ApplicationComponent } from './application-component/application-component';
import { ApplicationLandingComponent } from './application-landing-component/application-landing-component';
import { UserDetailsComponent } from './user-details-component/user-details-component';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { AuthCallbackComponent } from './auth-callback-component/auth-callback-component';
import { authGuard } from './auth-guard';
import { JobResumeComponent } from './job-resume-component/job-resume-component';
import { BaseResumeComponent } from './base-resume-component/base-resume-component';
import { ResumeService } from './services/resume.service';
import { ResumeComponent } from './resume-component/resume-component';
import { ResumeBuilderComponent } from './resume-builder-component/resume-builder-component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'applications-home', component: ApplicationLandingComponent, canActivate: [authGuard] },
    { path: 'application/add', component: ApplicationComponent, canActivate: [authGuard] },
    { path: 'application/:id', component: ApplicationComponent, canActivate: [authGuard] },
    { path: 'user-details', component: UserDetailsComponent, canActivate: [authGuard] },
    { path: 'auth/callback', component: AuthCallbackComponent },
    { path: 'resume', component: ResumeComponent,  canActivate: [authGuard] },
    { path: 'resume/add', component: ResumeBuilderComponent,  canActivate: [authGuard] },
    { path: 'resume/:id', component: ResumeBuilderComponent,  canActivate: [authGuard] },
];
