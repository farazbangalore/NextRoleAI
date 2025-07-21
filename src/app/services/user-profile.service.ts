import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserDetailsDto } from '../models/dto/user-details.dto';
import { ApiResponse } from '../models/api.response';
import { UserDetailsRequest } from '../models/request/user-details.request';



@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private baseUrl = 'http://127.0.0.1:8000';

    // BehaviorSubject to manage profile state
    private profileSubject = new BehaviorSubject<UserDetailsDto | null>(null);
    public profile$ = this.profileSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Get user profile
    getUserDetails(): Observable<ApiResponse> {

        return this.http.get<ApiResponse>(`${this.baseUrl}/users/user-details`)
            .pipe(
                tap(response => {
                    console.log('Fetched User Details:', response.data);
                }),
                catchError(this.handleError)
            );
    }

    // Update user profile
    updateUserProfile(userDetailsRequest: UserDetailsRequest): Observable<ApiResponse> {

        return this.http.put<ApiResponse>(`${this.baseUrl}/users/update-details`, userDetailsRequest)
            .pipe(
                tap(response => {
                    console.log('Fetched job applications:', response.data);
                }),
                catchError(this.handleError)
            );
    }

    // Upload profile photo
    uploadProfilePhoto(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('photo', file);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('nextRole_auth_token')}`,
            'user-id': '1234-user-id-xyz'
        });

        return this.http.post<{ success: boolean, photo_url: string }>(`${this.baseUrl}/user/upload-photo`, formData, { headers })
            .pipe(
                map(response => response.photo_url),
                catchError(this.handleError)
            );
    }


    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 400:
                    errorMessage = error.error?.message || 'Bad request';
                    break;
                case 401:
                    errorMessage = 'Unauthorized access';
                    break;
                case 404:
                    errorMessage = 'Profile not found';
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
