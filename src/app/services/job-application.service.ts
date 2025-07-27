import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JobApplicationRequest } from "../models/request/job-application.request";
import { Observable, throwError } from "rxjs";
import { ApiResponse } from "../models/api.response";
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from "./toast.service";
import { environment } from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private baseUrl = environment.BASE_URL;

    constructor(private http: HttpClient) {
    }

    addJobApplication(application: JobApplicationRequest, file: File): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Accept': 'multipart/form-data'
        });
        const formData = new FormData();
        formData.append('data', JSON.stringify(application));
        formData.append('file', file);
        return this.http.post<ApiResponse>(`${this.baseUrl}/job-application/`, formData, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code == 200) {
                        console.log('Application saved successfully:', response.data);
                    }
                }),
                catchError(this.handleError)
            );
    }

    getJobApplications(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.baseUrl}/job-application/list-all`)
            .pipe(
                tap(response => {
                    console.log('Fetched job applications:', response.data);
                }),
                catchError(this.handleError)
            );
    }

    getJobApplicationById(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.baseUrl}/job-application/${id}`)
            .pipe(
                tap(response => {
                    console.log('Fetched job application:', response.data);
                }),
                catchError(this.handleError)
            );
    }

    deleteJobApplicationById(id: string): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.baseUrl}/job-application/${id}`)
            .pipe(
                tap(response => {
                    console.log('Fetched job application:', response.data);
                }),
                catchError(this.handleError)
            );
    }

    updateJobApplication(id: string, request: JobApplicationRequest): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.put<ApiResponse>(`${this.baseUrl}/job-application/${id}`, request, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code == 200) {
                        console.log('Application updated successfully:', response.data);
                    }
                }),
                catchError(this.handleError)
            );
    }

    updateJobApplicationStatus(id: string, status: string): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.put<ApiResponse>(`${this.baseUrl}/job-application/${id}/${status}`, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code == 200) {
                        console.log('Application Status updated successfully:', response.data);
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