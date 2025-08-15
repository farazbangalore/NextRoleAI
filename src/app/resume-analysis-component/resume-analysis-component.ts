import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResumeAnalysis } from '../models/resume-analysis';
import { ResumeService } from '../services/resume.service';
import { ApiResponse } from '../models/api.response';
import { interval, Subscription } from 'rxjs';
import { ResumeAnalysisDto } from '../models/dto/resume-analysis.dto';

@Component({
  selector: 'app-resume-analysis-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resume-analysis-component.html',
  styleUrl: './resume-analysis-component.css'
})
export class ResumeAnalysisComponent implements OnInit, OnDestroy  {

  resumeAnalysisResult: ResumeAnalysis;
  atsScore = 0;
  isResumeAnalysisInProgress = false;
  isResumeAnalysisFetching = false;
  animationStep = 0;
  private animationInterval: Subscription | null = null;
  private apiSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private resumeService: ResumeService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // Fetch analysis data from service here (omitted, mock data above)
    this.route.paramMap.subscribe(params => {
      const jobApplicationId = params.get('jobApplicationId');
      if (jobApplicationId) {
        this.loadResumeAnalysis(jobApplicationId);
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

  private analyzeResume(jobApplicationId: string) {
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
          if(error.status === 404) {
            console.log('No analysis found for this job application, starting analysis...',error);
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
}
