import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConstants } from '../constants';
import { SignupRequest } from '../models/signup.request';
import { LoginRequest } from '../models/login.request';
import { AuthResponse } from '../models/auth.response';
import { ApiResponse } from '../models/api.response';
import { UserMetadata } from '../models/user_metadata';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8000';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private currentUserMetadata = new BehaviorSubject<UserMetadata | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserMetadata.asObservable();

    constructor(private http: HttpClient) {
    }

    public validateTokenOnAppLoad() {
        if (typeof window === 'undefined') {
            return;
        }
        const token = localStorage.getItem(AppConstants.JWT_TOKEN);
        if (!token) {
            this.clearAuthData();
            return;
        }

        this.http.get<ApiResponse>(`${this.baseUrl}/users/user-metadata`, {
            headers: { Authorization: `Bearer ${token}` }
        }).pipe(
            tap(response => {
                if (response.status_code == 200) {
                    const user: UserMetadata = {
                        id: response.data.id,
                        email: response.data.email,
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        avatar: response.data.avatar
                    };
                    this.isAuthenticatedSubject.next(true);
                    this.currentUserMetadata.next(user);
                    localStorage.setItem(AppConstants.JWT_TOKEN, token);
                    localStorage.setItem(AppConstants.USER_METADATA, JSON.stringify(user));
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
                    if (response.status_code === 200) {
                        const userData: UserMetadata = {
                            id: response.data.user.id,
                            email: response.data.user.user_metadata.email,
                            first_name: response.data.user.user_metadata.first_name,
                            last_name: response.data.user.user_metadata.last_name || '',
                            avatar: response.data.user.avatar || ''
                        }
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
            this.clearAuthData();
            return of(null);
        }

        return this.http.post(`${this.baseUrl}/users/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
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

    getCurrentUser(): UserMetadata | null {
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

    private setAuthData(token: string, user: UserMetadata): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(AppConstants.JWT_TOKEN, token);
            localStorage.setItem(AppConstants.USER_METADATA, JSON.stringify(user));
            this.isAuthenticatedSubject.next(true);
            this.currentUserMetadata.next(user);
        }
    }

    private clearAuthData(): void {
        if (typeof window !== 'undefined') {//DONOT COME HERE
            localStorage.removeItem(AppConstants.JWT_TOKEN);
            localStorage.removeItem(AppConstants.USER_METADATA);
        }
        this.isAuthenticatedSubject.next(false);
        this.currentUserMetadata.next(null);
    }

    private hasToken(): boolean {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(AppConstants.JWT_TOKEN);
        }
        return false;
    }

    private getUserFromStorage(): UserMetadata | null {
        if (typeof window !== 'undefined') {
            const userMetadata = localStorage.getItem(AppConstants.USER_METADATA);
            if (userMetadata) {
                try {
                    const user: UserMetadata | null = userMetadata ? JSON.parse(userMetadata) : null;
                    return user;
                } catch (e) {
                    console.error('Error parsing user metadata:', e);
                }
            }
        }
        return null;
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
