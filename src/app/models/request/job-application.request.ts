import { RecruiterInfo } from "./recruiter-info";

export interface JobApplicationRequest {
    job_id: string;
    company: string;
    title: string;
    ref_url?: string;
    status: string;
    applied_date: number;
    notes?: string;
    job_description?: string;
    recruiter_info?: RecruiterInfo;
}