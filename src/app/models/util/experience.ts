export interface Experience {
    id?: number;
    company: string;
    title: string;
    start_year: number;
    start_month: number;
    end_year?: number;
    end_month?: number;
    Summary: string[];
}