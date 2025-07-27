import { RecruiterInfo } from "../request/recruiter-info";

export interface JobApplicationDto {
    id: string;
    email: string;
    company: string;
    title: string;
    ref_url?: string;
    status: string;
    applied_date: number;
    notes?: string;
    job_description?: string;
    recruiter_info?: RecruiterInfo;
    created_at: number;
    modified_at: number;
    resume_url: string;
    ats_score: number;
    job_id: string;
}