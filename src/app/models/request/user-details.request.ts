import { Certification } from "../util/certification";
import { Education } from "../util/education";
import { Experience } from "../util/experience";
import { Skills } from "../util/skills";

export interface UserDetailsRequest {
    first_name: string;
    last_name?: string;
    photo_url?: string;
    education: Education[];
    experience: Experience[];
    skills?: Skills;
    certifications: Certification[];
    achievements: string[];
    leetcode_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
}