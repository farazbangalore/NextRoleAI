import { Certification } from "../util/certification";
import { Education } from "../util/education";
import { Experience } from "../util/experience";
import { Skills } from "../util/skills";

export interface OnboardUserDetailsRequest {
    first_name: string;
    email: string;
    last_name?: string;
}