import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService, BaseResume } from '../services/resume.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-resume-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './base-resume-component.html',
  styleUrl: './base-resume-component.css'
})
export class BaseResumeComponent  implements OnInit {
  baseResumes: BaseResume[] = [];
  isLoading = false;
  activeResumeMenu: string | null = null;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBaseResumes();
  }

  loadBaseResumes(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.baseResumes = this.resumeService.getMockBaseResumes();
      this.isLoading = false;
    }, 800);
  }

  createNewBaseResume(): void {
    this.router.navigate(['/resume/create']);
  }

  importFromProfile(): void {
    // Implementation for importing from user profile
    console.log('Import from profile');
  }

  editResume(resume: BaseResume): void {
    this.router.navigate(['/resume/edit', resume.id]);
  }

  duplicateResume(resume: BaseResume): void {
    console.log('Duplicate resume:', resume);
  }

  downloadResume(resume: BaseResume): void {
    console.log('Download resume:', resume);
  }

  setAsDefault(resume: BaseResume): void {
    console.log('Set as default:', resume);
  }

  deleteResume(resume: BaseResume): void {
    if (confirm(`Are you sure you want to delete "${resume.name}"?`)) {
      console.log('Delete resume:', resume);
    }
  }

  optimizeForJob(resume: BaseResume): void {
    this.router.navigate(['/resume/optimize'], { queryParams: { baseId: resume.id } });
  }

  toggleResumeMenu(resumeId: string): void {
    this.activeResumeMenu = this.activeResumeMenu === resumeId ? null : resumeId;
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