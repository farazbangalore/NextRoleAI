import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService, JobOrientedResume } from '../services/resume.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-resume-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './job-resume-component.html',
  styleUrl: './job-resume-component.css'
})
export class JobResumeComponent implements OnInit {
  jobOrientedResumes: JobOrientedResume[] = [];
  filteredResumes: JobOrientedResume[] = [];
  isLoading = false;
  activeResumeMenu: string | null = null;

  // Filters
  companyFilter = '';
  atsScoreFilter = '';
  sortBy = 'created_at';
  uniqueCompanies: string[] = []!;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobOrientedResumes();
  }

  loadJobOrientedResumes(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.jobOrientedResumes = this.resumeService.getMockJobOrientedResumes();
      this.uniqueCompanies = [...new Set(this.jobOrientedResumes.map(r => r.company_name).filter(Boolean))] as string[];
      this.applyFilters();
      this.isLoading = false;
    }, 800);
  }

  applyFilters(): void {
    let filtered = [...this.jobOrientedResumes];

    // Company filter
    if (this.companyFilter) {
      filtered = filtered.filter(resume => resume.company_name === this.companyFilter);
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
          return (a.company_name || '').localeCompare(b.company_name || '');
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

  viewResume(resume: JobOrientedResume): void {
    this.router.navigate(['/resume/view', resume.id]);
  }

  editResume(resume: JobOrientedResume): void {
    this.router.navigate(['/resume/edit', resume.id]);
  }

  reOptimize(resume: JobOrientedResume): void {
    console.log('Re-optimize resume:', resume);
  }

  downloadResume(resume: JobOrientedResume): void {
    console.log('Download resume:', resume);
  }

  deleteResume(resume: JobOrientedResume): void {
    if (confirm(`Are you sure you want to delete the resume for "${resume.job_title}" at "${resume.company_name}"?`)) {
      console.log('Delete resume:', resume);
    }
  }

  toggleResumeMenu(resumeId: string): void {
    this.activeResumeMenu = this.activeResumeMenu === resumeId ? null : resumeId;
  }

  getATSScoreClass(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  getATSScoreBarClass(score: number): string {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.activeResumeMenu = null;
    }
  }
}