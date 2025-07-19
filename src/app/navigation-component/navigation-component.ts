
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}


@Component({
  selector: 'app-navigation-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './navigation-component.html',
  styleUrl: './navigation-component.css'
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('userMenuRef', { static: false }) userMenuRef!: ElementRef;

  // Authentication state
  isAuthenticated = false;
  user: User | null = null;

  // UI state
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  notificationCount = 3;

  // Router subscription
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeAuthState();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Computed properties
  get userName(): string {
    return this.user?.name || 'Guest User';
  }

  get userEmail(): string {
    return this.user?.email || 'guest@example.com';
  }

  get userInitials(): string {
    if (!this.user?.name) return 'GU';
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Authentication methods
  private initializeAuthState(): void {
    // In a real app, this would check your authentication service
    // For demo purposes, we'll simulate based on current route
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus(): void {
    // Simulate checking authentication status
    // In real app, this would be: this.authService.isAuthenticated()
    const currentRoute = this.router.url;
    const authenticatedRoutes = ['/dashboard', '/applications', '/resume-builder', '/analytics', '/jobs', '/profile', '/settings', '/billing'];

    // this.isAuthenticated = authenticatedRoutes.some(route => currentRoute.startsWith(route));

    this.isAuthenticated = false;

    if (this.isAuthenticated) {
      // Mock user data - in real app, get from auth service
      this.user = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com'
      };
    } else {
      this.user = null;
    }
  }

  // Menu toggle methods
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Notification methods
  toggleNotifications(): void {
    // Implement notification panel toggle
    console.log('Toggle notifications');
  }

  // Help methods
  openHelp(): void {
    // Implement help system
    console.log('Open help');
  }

  // Authentication actions
  logout(): void {
    // In real app, this would call your auth service
    console.log('Logging out...');

    // Clear auth state
    this.isAuthenticated = false;
    this.user = null;

    // Close menus
    this.closeUserMenu();
    this.closeMobileMenu();

    // Redirect to home
    this.router.navigate(['/']);
  }

  // Router event handling
  private subscribeToRouterEvents(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Update auth state on route change
        this.checkAuthenticationStatus();

        // Close mobile menu on navigation
        this.closeMobileMenu();
      });
  }

  // Click outside to close menus
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close user menu if clicking outside
    if (this.isUserMenuOpen && this.userMenuRef && !this.userMenuRef.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }

  // Utility methods
  navigateToRoute(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  // Method to handle authentication state changes from external sources
  updateAuthState(isAuthenticated: boolean, user: User | null = null): void {
    this.isAuthenticated = isAuthenticated;
    this.user = user;
  }

  login(): void {
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
