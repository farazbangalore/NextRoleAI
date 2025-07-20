import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Interfaces matching the DTOs
export interface Education {
    id?: string;
    institution_name: string;
    start_year: number;
    end_year?: number;
    course: string;
    score: number;
}

export interface Certification {
    id?: string;
    name: string;
    issuing_organization: string;
    credential_url?: string;
    issue_year: number;
    issue_month: number;
    expiry_year?: number;
    expiry_month?: number;
}


export interface Experience {
    id?: string;
    company: string;
    title: string;
    start_year: number;
    start_month: number;
    end_year?: number;
    end_month?: number;
    Summary: string[];
}

export interface Skills {
    technical_skills: string[];
    soft_skills: string[];
}

export interface UserProfile {
    first_name: string;
    last_name?: string;
    email: string;
    photo_url?: string;
    education: Education[];
    experience: Experience[];
    skills?: Skills;
    certifications: Certification[];
    achievements: string[];
    leetcode_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    created_at: number;
    modified_at: number;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    user: UserProfile;
}

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private baseUrl = 'http://127.0.0.1:8000';

    // BehaviorSubject to manage profile state
    private profileSubject = new BehaviorSubject<UserProfile | null>(null);
    public profile$ = this.profileSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Get user profile
    getUserProfile(): Observable<UserProfile> {
        const headers = this.getAuthHeaders();

        return this.http.get<ProfileResponse>(`${this.baseUrl}/user/profile`, { headers })
            .pipe(
                map(response => response.user),
                tap(profile => this.profileSubject.next(profile)),
                catchError(this.handleError)
            );
    }

    // Update user profile
    updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
        const headers = this.getAuthHeaders();

        return this.http.put<ProfileResponse>(`${this.baseUrl}/user/profile`, profile, { headers })
            .pipe(
                map(response => response.user),
                tap(updatedProfile => this.profileSubject.next(updatedProfile)),
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

    // Mock data for development
    getMockProfile(): UserProfile {
        return {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            education: [
                {
                    id: '1',
                    institution_name: 'Stanford University',
                    start_year: 2018,
                    end_year: 2022,
                    course: 'Computer Science',
                    score: 3.8
                },
                {
                    id: '2',
                    institution_name: 'MIT',
                    start_year: 2022,
                    end_year: 2024,
                    course: 'Masters in AI',
                    score: 3.9
                }
            ],
            experience: [
                {
                    id: '1',
                    company: 'Google',
                    title: 'Software Engineer',
                    start_year: 2022,
                    start_month: 6,
                    end_year: 2024,
                    end_month: 12,
                    Summary: [
                        'Developed scalable web applications using React and Node.js',
                        'Led a team of 4 developers on critical product features',
                        'Improved application performance by 40% through optimization'
                    ]
                },
                {
                    id: '2',
                    company: 'Microsoft',
                    title: 'Senior Software Engineer',
                    start_year: 2025,
                    start_month: 1,
                    Summary: [
                        'Working on Azure cloud infrastructure',
                        'Building AI-powered developer tools',
                        'Mentoring junior developers'
                    ]
                }
            ],
            skills: {
                technical_skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
                soft_skills: ['Leadership', 'Communication', 'Problem Solving', 'Team Management']
            },
            certifications: [
                {
                    id: '1',
                    name: 'AWS Solutions Architect Associate',
                    issuing_organization: 'Amazon Web Services',
                    credential_url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
                    issue_year: 2023,
                    issue_month: 6,
                    expiry_year: 2026,
                    expiry_month: 6
                },
                {
                    id: '2',
                    name: 'Google Cloud Professional Developer',
                    issuing_organization: 'Google Cloud',
                    credential_url: 'https://cloud.google.com/certification/cloud-developer',
                    issue_year: 2023,
                    issue_month: 9,
                    expiry_year: 2025,
                    expiry_month: 9
                },
                {
                    id: '3',
                    name: 'Certified Kubernetes Administrator',
                    issuing_organization: 'Cloud Native Computing Foundation',
                    credential_url: 'https://www.cncf.io/certification/cka/',
                    issue_year: 2024,
                    issue_month: 1
                }
            ],
            achievements: [
                'Winner of Google Code Jam 2023',
                'Published 3 research papers on AI',
                'Speaker at TechConf 2024',
                'Contributor to 5+ open source projects'
            ],
            leetcode_url: 'https://leetcode.com/johndoe',
            linkedin_url: 'https://linkedin.com/in/johndoe',
            portfolio_url: 'https://johndoe.dev',
            created_at: Date.now(),
            modified_at: Date.now()
        };
    }
}
