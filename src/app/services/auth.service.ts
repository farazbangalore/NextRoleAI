import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Interfaces
export interface SignupRequest {
    email: string;
    password: string;
    first_name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        first_name: string;
        last_name?: string;
        created_at: string;
    };
    token?: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name?: string;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8000';
    private tokenKey = 'nextRole_auth_token';
    private userKey = 'nextRole_user_data';

    // Observable for auth state management
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Signup method
    signup(signupData: SignupRequest): Observable<AuthResponse> {
        console.log('Signup Service:', signupData);
        const headers = new HttpHeaders({
            'user-id': '1234-user-id-xyz', // This should be dynamic in real implementation
            'Content-Type': 'application/json'
        });

        return this.http.post<AuthResponse>(`${this.baseUrl}/users/signup`, signupData, { headers })
            .pipe(
                tap(response => {
                    if (response.success && response.token && response.user) {
                        this.setAuthData(response.token, response.user);
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Login method
    login(loginData: LoginRequest): Observable<AuthResponse> {
        const headers = new HttpHeaders({
            'user-id': '1234-user-id-xyz',
            'Content-Type': 'application/json'
        });

        return this.http.post<AuthResponse>(`${this.baseUrl}/users/login`, loginData, { headers })
            .pipe(
                tap(response => {
                    if (response.success && response.token && response.user) {
                        this.setAuthData(response.token, response.user);
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Social login methods
    googleLogin(): Observable<AuthResponse> {
        // Implementation for Google OAuth
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/google`, {})
            .pipe(
                tap(response => {
                    if (response.success && response.token && response.user) {
                        this.setAuthData(response.token, response.user);
                    }
                }),
                catchError(this.handleError)
            );
    }

    linkedinLogin(): Observable<AuthResponse> {
        // Implementation for LinkedIn OAuth
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/linkedin`, {})
            .pipe(
                tap(response => {
                    if (response.success && response.token && response.user) {
                        this.setAuthData(response.token, response.user);
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Logout method
    logout(): Observable<any> {
        const headers = this.getAuthHeaders();

        return this.http.post(`${this.baseUrl}/users/logout`, {}, { headers })
            .pipe(
                tap(() => {
                    this.clearAuthData();
                }),
                catchError(this.handleError)
            );
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.hasToken() && !this.isTokenExpired();
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Get auth token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Private helper methods
    private setAuthData(token: string, user: User): void {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));

        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);

        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
    }

    private hasToken(): boolean {
        return false;
        // return !!localStorage.getItem(this.tokenKey);
    }

    private getUserFromStorage(): User | null {
        return null;
        // const userData = localStorage.getItem(this.userKey);
        // return userData ? JSON.parse(userData) : null;
    }

    private isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch {
            return true;
        }
    }

    private getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'user-id': '1234-user-id-xyz',
            'Content-Type': 'application/json'
        });
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            switch (error.status) {
                case 400:
                    errorMessage = error.error?.message || 'Bad request';
                    break;
                case 401:
                    errorMessage = 'Invalid credentials';
                    break;
                case 403:
                    errorMessage = 'Access denied';
                    break;
                case 404:
                    errorMessage = 'Service not found';
                    break;
                case 409:
                    errorMessage = 'Email already exists';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later';
                    break;
                default:
                    errorMessage = error.error?.message || 'An error occurred';
            }
        }

        return throwError(errorMessage);
    }
}
