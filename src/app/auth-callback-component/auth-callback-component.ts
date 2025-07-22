import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppConstants } from '../constants';
import { AuthCallbackService } from '../services/auth.callback.service';
import { OnboardUserDetailsRequest } from '../models/request/onbaord-user-details.request';

@Component({
  selector: 'app-auth-callback-component',
  imports: [],
  templateUrl: './auth-callback-component.html',
  styleUrl: './auth-callback-component.css'
})
export class AuthCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private authCallbackService: AuthCallbackService
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      console.log('URL Fragment:', fragment);

      const params = new URLSearchParams(fragment || '');
      const accessToken: string = params.get('access_token') as string;
      console.log('Access Token:', accessToken);

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(AppConstants.JWT_TOKEN, accessToken);
      }
      this.authService.validateTokenOnAppLoad();
      this.onbaordUserDetails(accessToken);
    });

  }

  onbaordUserDetails(access_token:string): void {
    this.authCallbackService.onbaordUserDetails(access_token).subscribe({
      next: (response) => {
        console.log('User onboarded successfully:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error onboarding user:', error);
      }
    });
  }
}