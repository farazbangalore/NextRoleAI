import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Resume Interfaces
export interface BaseResume {
    id: string;
    name: string;
    template: string;
    personal_info: PersonalInfo;
    sections: ResumeSection[];
    created_at: string;
    updated_at: string;
    is_default: boolean;
}

export interface JobOrientedResume {
    id: string;
    name: string;
    base_resume_id: string;
    job_application_id?: string;
    company_name?: string;
    job_title?: string;
    optimizations: ResumeOptimization[];
    ats_score: number;
    created_at: string;
    updated_at: string;
}

export interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    summary: string;
}

export interface ResumeSection {
    id: string;
    type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
    title: string;
    content: any;
    order: number;
    visible: boolean;
}

export interface ResumeOptimization {
    section: string;
    original_content: string;
    optimized_content: string;
    reasoning: string;
    improvement_score: number;
}

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private baseUrl = 'http://127.0.0.1:8000';

    private baseResumesSubject = new BehaviorSubject<BaseResume[]>([]);
    private jobOrientedResumesSubject = new BehaviorSubject<JobOrientedResume[]>([]);

    public baseResumes$ = this.baseResumesSubject.asObservable();
    public jobOrientedResumes$ = this.jobOrientedResumesSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Base Resume Methods
    getBaseResumes(): Observable<BaseResume[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<{ success: boolean, resumes: BaseResume[] }>(`${this.baseUrl}/resumes/base`, { headers })
            .pipe(
                map(response => response.resumes),
                tap(resumes => this.baseResumesSubject.next(resumes)),
                catchError(this.handleError)
            );
    }

    createBaseResume(resumeData: Partial<BaseResume>): Observable<BaseResume> {
        const headers = this.getAuthHeaders();
        return this.http.post<{ success: boolean, resume: BaseResume }>(`${this.baseUrl}/resumes/base`, resumeData, { headers })
            .pipe(
                map(response => response.resume),
                catchError(this.handleError)
            );
    }

    // Job Oriented Resume Methods
    getJobOrientedResumes(): Observable<JobOrientedResume[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<{ success: boolean, resumes: JobOrientedResume[] }>(`${this.baseUrl}/resumes/job-oriented`, { headers })
            .pipe(
                map(response => response.resumes),
                tap(resumes => this.jobOrientedResumesSubject.next(resumes)),
                catchError(this.handleError)
            );
    }

    optimizeResumeForJob(baseResumeId: string, jobApplicationId: string): Observable<JobOrientedResume> {
        const headers = this.getAuthHeaders();
        return this.http.post<{ success: boolean, resume: JobOrientedResume }>(`${this.baseUrl}/resumes/optimize`, {
            base_resume_id: baseResumeId,
            job_application_id: jobApplicationId
        }, { headers })
            .pipe(
                map(response => response.resume),
                catchError(this.handleError)
            );
    }

    // Helper methods
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('nextRole_auth_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'user-id': '1234-user-id-xyz',
            'Content-Type': 'application/json'
        });
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
                    errorMessage = 'Resume not found';
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

    // Mock data for development
    getMockBaseResumes(): BaseResume[] {
        return [
            {
                id: '1',
                name: 'Software Engineer Resume',
                template: 'modern',
                personal_info: {
                    full_name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    location: 'San Francisco, CA',
                    linkedin: 'https://linkedin.com/in/johndoe',
                    portfolio: 'https://johndoe.dev',
                    summary: 'Experienced software engineer with 5+ years in full-stack development.'
                },
                sections: [],
                created_at: '2025-01-15T10:00:00Z',
                updated_at: '2025-01-20T14:30:00Z',
                is_default: true
            }
        ];
    }

    getMockJobOrientedResumes(): JobOrientedResume[] {
        return [
            {
                id: '1',
                name: 'Google - Senior Frontend Developer',
                base_resume_id: '1',
                job_application_id: '1',
                company_name: 'Google',
                job_title: 'Senior Frontend Developer',
                optimizations: [],
                ats_score: 94,
                created_at: '2025-01-18T09:15:00Z',
                updated_at: '2025-01-18T09:15:00Z'
            },
            {
                id: '2',
                name: 'Microsoft - Full Stack Engineer',
                base_resume_id: '1',
                job_application_id: '2',
                company_name: 'Microsoft',
                job_title: 'Full Stack Engineer',
                optimizations: [],
                ats_score: 89,
                created_at: '2025-01-19T11:20:00Z',
                updated_at: '2025-01-19T11:20:00Z'
            }
        ];
    }

    // Add these methods to the existing ResumeService

    // Create base resume with file upload
    createBaseResumeWithFile(formData: FormData): Observable<BaseResume> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('nextRole_auth_token')}`,
            'user-id': '1234-user-id-xyz'
            // Don't set Content-Type for FormData, let browser set it
        });

        return this.http.post<{ success: boolean, resume: BaseResume }>(`${this.baseUrl}/resumes/base/upload`, formData, { headers })
            .pipe(
                map(response => response.resume),
                tap(resume => {
                    const current = this.baseResumesSubject.value;
                    this.baseResumesSubject.next([resume, ...current]);
                }),
                catchError(this.handleError)
            );
    }

    // Update base resume with file upload
    updateBaseResumeWithFile(id: string, formData: FormData): Observable<BaseResume> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('nextRole_auth_token')}`,
            'user-id': '1234-user-id-xyz'
        });

        return this.http.put<{ success: boolean, resume: BaseResume }>(`${this.baseUrl}/resumes/base/${id}/upload`, formData, { headers })
            .pipe(
                map(response => response.resume),
                tap(updatedResume => {
                    const current = this.baseResumesSubject.value;
                    const index = current.findIndex(r => r.id === id);
                    if (index !== -1) {
                        current[index] = updatedResume;
                        this.baseResumesSubject.next([...current]);
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Get base resume by ID
    getBaseResumeById(id: string): Observable<BaseResume> {
        const headers = this.getAuthHeaders();

        return this.http.get<{ success: boolean, resume: BaseResume }>(`${this.baseUrl}/resumes/base/${id}`, { headers })
            .pipe(
                map(response => response.resume),
                catchError(this.handleError)
            );
    }
}
