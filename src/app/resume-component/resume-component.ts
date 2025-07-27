import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService, BaseResume, JobOrientedResume } from '../services/resume.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseResumeComponent } from '../base-resume-component/base-resume-component';
import { JobResumeComponent } from '../job-resume-component/job-resume-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-component',
  imports: [FormsModule, BaseResumeComponent, JobResumeComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './resume-component.html',
  styleUrl: './resume-component.css'
})
export class ResumeComponent implements OnInit {
  activeTab: 'base' | 'job-oriented' = 'job-oriented';
  baseResumes: BaseResume[] = [];

  // Statistics
  baseResumeCount = 0;
  jobBasedResumeCount = 0;
  totalResumes = 0;
  averageATSScore = 0;
  totalDownloads = 24;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    // Load base resumes
    // setTimeout(() => {
    //   this.baseResumes = this.resumeService.getMockBaseResumes();
    //   this.baseResumeCount = this.baseResumes.length;
    //   this.calculateStats();
    // }, 500);

    // // Load job-oriented resumes
    // setTimeout(() => {
    //   this.jobOrientedResumes = this.resumeService.getMockJobOrientedResumes();
    //   this.jobOrientedResumeCount = this.jobOrientedResumes.length;
    //   this.calculateStats();
    // }, 700);
  }

  calculateStats(): void {
    this.totalResumes = this.baseResumeCount;
    this.averageATSScore = 0;

  }

  createNewResume(): void {
    this.router.navigate(['/resume/create']);
  }

  optimizeForJob(): void {
    this.router.navigate(['/resume/optimize']);
  }

  importFromLinkedIn(): void {
    // Implementation for LinkedIn import
    console.log('Import from LinkedIn');
  }

  getJobBasedResumeCount(value: number): void {
    this.jobBasedResumeCount = value;
  }
}