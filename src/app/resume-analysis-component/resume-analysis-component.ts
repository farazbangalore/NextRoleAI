import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResumeAnalysis } from '../models/resume-analysis';
import { ResumeService } from '../services/resume.service';
import { ApiResponse } from '../models/api.response';

@Component({
  selector: 'app-resume-analysis-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resume-analysis-component.html',
  styleUrl: './resume-analysis-component.css'
})
export class ResumeAnalysisComponent implements OnInit {

  resumeAnalysisResult: ResumeAnalysis;
  atsScore = 0;
  isLoading = true;


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
        this.analyzeResume(jobApplicationId);
      }
    });
  }

  private analyzeResume(jobApplicationId: string) {
    this.resumeService.analyzeResume(jobApplicationId)
      .subscribe({
        next: (response: ApiResponse) => {
          this.resumeAnalysisResult = response.data as ResumeAnalysis;
          this.atsScore = this.resumeAnalysisResult.atsScore;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isLoading = false;
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
