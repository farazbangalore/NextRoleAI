import { ResumeAnalysisComponent } from "../../resume-analysis-component/resume-analysis-component";
import { ResumeAnalysis } from "../resume-analysis";
import { Certification } from "../util/certification";
import { Education } from "../util/education";
import { Experience } from "../util/experience";
import { Skills } from "../util/skills";

export interface ResumeAnalysisDto {
    id: string;
    email: string;
    resume_analysis_summary: ResumeAnalysis
}