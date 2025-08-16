import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResumeAnalysis } from '../models/resume-analysis';
import { ResumeService } from '../services/resume.service';
import { ApiResponse } from '../models/api.response';
import { interval, Subscription } from 'rxjs';
import { ResumeAnalysisDto } from '../models/dto/resume-analysis.dto';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplicationDto } from '../models/dto/job-application.dto';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-resume-analysis-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resume-analysis-component.html',
  styleUrl: './resume-analysis-component.css'
})
export class ResumeAnalysisComponent implements OnInit, OnDestroy {

  resumeAnalysisResult: ResumeAnalysis;
  atsScore = 0;
  isResumeAnalysisInProgress = false;
  isResumeAnalysisFetching = false;
  animationStep = 0;
  jobApplicationId: string = '';
  isJdModelOpen = false;
  isJdFetching = false;
  job_description: string = '';
  private animationInterval: Subscription | null = null;
  private apiSub: Subscription | null = null;
  uploadedFile: File;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private cdr: ChangeDetectorRef,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService
  ) { }
  ngOnInit() {
    // Fetch analysis data from service here (omitted, mock data above)
    this.route.paramMap.subscribe(params => {
      this.jobApplicationId = params.get('jobApplicationId') as string;
      if (this.jobApplicationId) {
        this.loadResumeAnalysis(this.jobApplicationId);
      }
    });
  }


  startStepper() {
    this.animationStep = 0;
    this.animationInterval = interval(6000).subscribe(() => {
      this.animationStep = (this.animationStep + 1) % 5;
      this.cdr.markForCheck();
    });
  }

  stopStepper() {
    if (this.animationInterval) {
      this.animationInterval.unsubscribe();
      this.animationInterval = null;
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    this.stopStepper();
    if (this.apiSub) this.apiSub.unsubscribe();
    this.cdr.markForCheck();
  }

  public analyzeResume(jobApplicationId: string) {
    this.isResumeAnalysisInProgress = true;
    this.startStepper();
    this.resumeService.analyzeResume(jobApplicationId)
      .subscribe({
        next: (response: ApiResponse) => {
          this.resumeAnalysisResult = response.data as ResumeAnalysis;
          this.atsScore = this.resumeAnalysisResult.atsScore;
          this.isResumeAnalysisInProgress = false;
          this.stopStepper();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.stopStepper();
          this.isResumeAnalysisInProgress = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadResumeAnalysis(jobApplicationId: string) {
    this.isResumeAnalysisFetching = true;
    this.resumeService.getResumeAnalysisById(jobApplicationId)
      .subscribe({
        next: (response: ApiResponse) => {
          console.log('Resume analysis response:', response);
          const resumeAnalysisDto = response.data as ResumeAnalysisDto;
          this.resumeAnalysisResult = resumeAnalysisDto.resume_analysis_summary;
          this.atsScore = this.resumeAnalysisResult.atsScore;
          this.isResumeAnalysisFetching = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          if (error.status === 404) {
            console.log('No analysis found for this job application, starting analysis...', error);
            this.analyzeResume(jobApplicationId);
            this.isResumeAnalysisFetching = false;
            this.cdr.markForCheck();
          }
          this.isResumeAnalysisFetching = false;
        }
      });
  }

  goBack() {
    // Navigate back
    window.history.back();
  }

  downloadPDF() {
    // Implement PDF download functionality.
    alert('Download feature coming soon!');
  }

  editResume() {
    // Navigate to resume edit page
    alert('Navigate to edit page!');
  }

  viewJobDescription() {
    this.isJdModelOpen = true;
    this.loadApplication();
    this.cdr.markForCheck();
  }

  closeJdModal() {
    this.isJdModelOpen = false;
  }

  loadApplication(): void {
    this.isJdFetching = true;
    this.jobApplicationService.getJobApplicationById(this.jobApplicationId).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          const jobApplication = response.data[0] as JobApplicationDto;
          this.job_description = jobApplication.job_description || '';
        }
        this.isJdFetching = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isJdFetching = false;
        this.toastService.showError('Failed to load application', 2000);
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    console.log("Selected File:");
    console.log(file?.name);
    this.handleFileSelection(file);
  }

  private handleFileSelection(file: File | undefined): void {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return;
    }

    this.uploadedFile = file;
    this.updateResume(file);
    // this.clearMessages();
  }

  updateResume(file: File) {
    this.isResumeAnalysisInProgress = true;
    this.jobApplicationService.updateJobApplicationResume(this.jobApplicationId, file).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.analyzeResume(this.jobApplicationId);
          // this.isResumeAnalysisInProgress = false;
          this.cdr.markForCheck();
        } else {
          console.error('Error saving application:', response.message);
          this.isResumeAnalysisInProgress = false;
        }
      },
      error: (error) => {
        console.error('Error saving application:', error);
        alert('Failed to save application. Please try again later.');
      }
    });
  }
}
