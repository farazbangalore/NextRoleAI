export interface AnalysisSection {
    sectionType: string;
    sectionTitle: string;
    score: number;
    keywordsMatched: string[];
    sectionFeedback: string;
    suggestions: string[];
    missingKeywords: string[];
}

export interface ResumeAnalysis {
    resumeName: string;
    jobTitle: string;
    companyName: string;
    atsScore: number;
    summary: string;
    analysisSections: AnalysisSection[];
    recommendations: string[];
}
