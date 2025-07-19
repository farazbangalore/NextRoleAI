import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService, LoginRequest, SignupRequest } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  isLoginMode = true;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
    terms: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  toggleMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.resetForm();
    this.clearError();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.clearError();
    console.log('Login submitted:', this.formData);
    console.log('Login mode:', this.isLoginMode);

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleSignUp();
    }
  }

  handleLogin() {
    console.log('Validation:', this.validateLoginForm());
    // if (!this.validateLoginForm()) {
    //   return;
    // }

    this.isLoading = true;

    const loginData: LoginRequest = {
      email: this.formData.email,
      password: this.formData.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showSuccess('Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.showError(response.message || 'Login failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error);
      }
    });
  }

  handleSignUp() {
    console.log('Validation:', this.validateSignupForm());
    if (!this.validateSignupForm()) {
      return;
    }

    this.isLoading = true;

    const signupData: SignupRequest = {
      email: this.formData.email,
      password: this.formData.password,
      first_name: this.formData.firstName
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showSuccess('Account created successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          this.showError(response.message || 'Signup failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error);
      }
    });
  }

  handleGoogleLogin() {
    this.isLoading = true;
    this.clearError();

    this.authService.googleLogin().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.showError(response.message || 'Google login failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error);
      }
    });
  }

  handleLinkedInLogin() {
    this.isLoading = true;
    this.clearError();

    this.authService.linkedinLogin().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.showError(response.message || 'LinkedIn login failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error);
      }
    });
  }

  private validateLoginForm(): boolean {
    if (!this.formData.email || !this.formData.password) {
      this.showError('Please fill in all required fields');
      return false;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }

    return true;
  }

  private validateSignupForm(): boolean {
    if (!this.formData.firstName || !this.formData.email || !this.formData.password) {
      this.showError('Please fill in all required fields');
      return false;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }

    if (this.formData.password.length < 8) {
      this.showError('Password must be at least 8 characters long');
      return false;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.showError('Passwords do not match');
      return false;
    }

    if (!this.formData.terms) {
      this.showError('Please accept the terms and conditions');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  private showSuccess(message: string) {
    // You can implement a toast notification service here
    console.log('Success:', message);
  }

  private clearError() {
    this.errorMessage = '';
  }

  private resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
      terms: false
    };
  }
}