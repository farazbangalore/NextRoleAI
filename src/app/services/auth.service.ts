import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConstants } from '../constants';
import { SignupRequest } from '../models/signup.request';
import { LoginRequest } from '../models/login.request';
import { AuthResponse } from '../models/auth.response';
import { ApiResponse } from '../models/api.response';
import { User } from '../models/user_metadata';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8000';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) {
        this.validateTokenOnAppLoad();
    }

    private validateTokenOnAppLoad() {
        if (typeof window === 'undefined') {
            return;
        }
        const token = localStorage.getItem(AppConstants.JWT_TOKEN);
        if (!token) {
            this.clearAuthData();
            return;
        }

        this.http.get<{ userId: string, email: string }>(`${this.baseUrl}/users/user-metadata`, {
            headers: { Authorization: `Bearer ${token}` }
        }).pipe(
            tap(response => {
                if (response && response.userId && response.email) {
                    const user: User = {
                        id: response.userId,
                        email: response.email,
                    };
                    this.isAuthenticatedSubject.next(true);
                    localStorage.setItem(AppConstants.USER_METADATA, JSON.stringify(user));
                    localStorage.setItem(AppConstants.JWT_TOKEN, token);
                } else {
                    this.clearAuthData();
                }
            }),
            catchError(err => {
                this.clearAuthData();
                return of(null);
            })
        ).subscribe();
    }

    signup(signupData: SignupRequest): Observable<AuthResponse> {
        console.log('Signup Service:', signupData);
        const headers = new HttpHeaders({
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

    login(loginData: LoginRequest): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<ApiResponse>(`${this.baseUrl}/users/login`, loginData, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code === 200 && response.data?.session?.access_token) {
                        // Extract user data from response if available
                        const userData = response.data.user || null;
                        this.setAuthData(response.data.session.access_token, userData);
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Social login methods
    googleLogin(): Observable<AuthResponse> {
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
        const token = this.getToken();
        if (!token) {
            // If no token, just clear local data
            this.clearAuthData();
            return of(null);
        }

        const headers = this.getAuthHeaders();
        return this.http.post(`${this.baseUrl}/users/logout`, {}, { headers })
            .pipe(
                tap(() => {
                    this.clearAuthData();
                }),
                catchError(err => {
                    this.clearAuthData();
                    return of(null);
                })
            );
    }

    isAuthenticated(): boolean {
        return this.hasToken() && !this.isTokenExpired();
    }

    getCurrentUser(): User | null {
        if (typeof window === 'undefined') {
            return null;
        }

        const userData = localStorage.getItem(AppConstants.USER_METADATA);
        if (userData && this.getToken()) {
            try {
                return JSON.parse(userData);
            } catch {
                return null;
            }
        }
        return null;
    }

    getToken(): string | null {
        return typeof window !== 'undefined' ? localStorage.getItem(AppConstants.JWT_TOKEN) : null;
    }

    // Private helper methods - FIXED
    private setAuthData(token: string, user?: any): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(AppConstants.JWT_TOKEN, token);

            if (user) {
                localStorage.setItem(AppConstants.USER_METADATA, JSON.stringify(user));
            }

            this.isAuthenticatedSubject.next(true);
        }
    }

    private clearAuthData(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AppConstants.JWT_TOKEN);
            localStorage.removeItem(AppConstants.USER_METADATA); 
        }
        this.isAuthenticatedSubject.next(false);
    }

    private hasToken(): boolean {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(AppConstants.JWT_TOKEN);
        }
        return false;
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
