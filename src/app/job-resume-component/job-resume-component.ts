import { Component, OnInit, HostListener, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService, JobOrientedResume } from '../services/resume.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobBasedResumeDto } from '../models/dto/job-based-resume.dto';
import { ApiResponse } from '../models/api.response';
import { DocumentUtils } from '../utils/document-utils';
import { TimeUtils } from '../utils/time-utils';

@Component({
  selector: 'app-job-resume-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './job-resume-component.html',
  styleUrl: './job-resume-component.css'
})
export class JobResumeComponent implements OnInit {
  
  @Output() jobBasedResumeCount = new EventEmitter<number>();
  jobBasedResumes: JobBasedResumeDto[] = [];
  filteredResumes: JobBasedResumeDto[] = [];
  isFetchingJobBasedResumes = false;
  activeResumeMenu: string | null = null;

  // Filters
  companyFilter = '';
  atsScoreFilter = '';
  sortBy = 'created_at';
  uniqueCompanies: string[] = []!;

  constructor(
    private resumeService: ResumeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadJobOrientedResumes();
  }

  loadJobOrientedResumes(): void {
    this.isFetchingJobBasedResumes = true;
    this.resumeService.getAllJobBasedResume()
      .subscribe({
        next: (response: ApiResponse) => {
          this.jobBasedResumes = response.data as JobBasedResumeDto[];
          this.filteredResumes = this.jobBasedResumes;
          console.log("Job based resumes: ", this.jobBasedResumes);
          this.jobBasedResumeCount.emit(this.jobBasedResumes.length);
          this.isFetchingJobBasedResumes = false;
          // this.buildApplicationStatusMap();
          // this.refreshStats();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isFetchingJobBasedResumes = false;
          this.cdr.markForCheck();
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.jobBasedResumes];

    // Company filter
    if (this.companyFilter) {
      filtered = filtered.filter(resume => resume.company === this.companyFilter);
    }

    // ATS Score filter
    if (this.atsScoreFilter) {
      switch (this.atsScoreFilter) {
        case '90+':
          filtered = filtered.filter(resume => resume.ats_score >= 90);
          break;
        case '80-89':
          filtered = filtered.filter(resume => resume.ats_score >= 80 && resume.ats_score < 90);
          break;
        case '70-79':
          filtered = filtered.filter(resume => resume.ats_score >= 70 && resume.ats_score < 80);
          break;
        case 'below70':
          filtered = filtered.filter(resume => resume.ats_score < 70);
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'ats_score':
          return b.ats_score - a.ats_score;
        case 'company_name':
          return (a.company || '').localeCompare(b.company || '');
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    this.filteredResumes = filtered;
  }

  createOptimizedResume(): void {
    this.router.navigate(['/resume/optimize']);
  }

  viewResume(resume: JobBasedResumeDto): void {
    this.router.navigate(['/resume/view', resume.id]);
  }

  editResume(resume: JobBasedResumeDto): void {
    this.router.navigate(['/resume/edit', resume.id]);
  }

  reOptimize(resume: JobBasedResumeDto): void {
    console.log('Re-optimize resume:', resume);
  }

  downloadResume(resume: JobBasedResumeDto): void {
    console.log('Download resume:', resume);
  }

  deleteResume(resume: JobBasedResumeDto): void {
    if (confirm(`Are you sure you want to delete the resume for "${resume.title}" at "${resume.company}"?`)) {
      console.log('Delete resume:', resume);
    }
  }

  toggleResumeMenu(resumeId: string): void {
    this.activeResumeMenu = this.activeResumeMenu === resumeId ? null : resumeId;
  }

  getATSScoreClass(score: number): string {
    if (score == null) {
      return 'text-slate-400';
    }
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-500';
  }

  getATSScoreBarClass(score: number): string {
    if (score == null) {
      return 'text-slate-400';
    }
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getTimeAgo(epochMillis: number): string {
    console.log(epochMillis);
    return TimeUtils.getTimeAgo(epochMillis);
  }

  getResumeName(resume: JobBasedResumeDto): string {
    const result = DocumentUtils.getDocumentName(resume.resume_url)
    console.log("File Name", result);
    return result;
  }

  getAtsScore(atsScore: any): string {
    if (atsScore == null) {
      return 'Not Analyzed';
    }
    return `${atsScore}%`;
  }
}