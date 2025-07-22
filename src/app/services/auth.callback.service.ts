import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.response';
import { OnboardUserDetailsRequest } from '../models/request/onbaord-user-details.request';

@Injectable({
    providedIn: 'root'
})
export class AuthCallbackService {
    private baseUrl = environment.BASE_URL;

    constructor(private http: HttpClient) {
    }

    onbaordUserDetails(access_token: string): Observable<ApiResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        });
        return this.http.post<ApiResponse>(`${this.baseUrl}/users/onboard`, { headers })
            .pipe(
                tap(response => {
                    if (response.status_code == 200) {
                        console.log('User Onbaorded Successfully', response.data);
                    }
                }),
            );
    }



}
