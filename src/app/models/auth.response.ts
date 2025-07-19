export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        first_name: string;
        last_name?: string;
        created_at: string;
    };
    token?: string;
}