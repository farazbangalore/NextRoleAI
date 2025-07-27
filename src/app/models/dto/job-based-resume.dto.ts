export interface JobBasedResumeDto {
    id: string;
    company: string;
    title: string;
    modified_at: number;
    created_at: number;
    ats_score: number;
    resume_url:string,
    resume_name?: string
}