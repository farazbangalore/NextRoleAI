export interface Certification {
    id?: number;
    name: string;
    issuing_organization: string;
    credential_url?: string;
    issue_year: number;
    issue_month: number;
    expiry_year?: number;
    expiry_month?: number;
}