import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JobApplicationRequest } from "../models/request/job-application.request";
import { Observable, throwError } from "rxjs";
import { ApiResponse } from "../models/api.response";
import { catchError, tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private baseUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) {
    }

    addJobApplication(application: JobApplicationRequest): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<ApiResponse>(`${this.baseUrl}/job-application/`, application, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code == 200) {
                        console.log('Application saved successfully:', response.data);
                    }
                }),
                catchError(this.handleError)
            );
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