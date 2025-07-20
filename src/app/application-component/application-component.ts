import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplicationRequest } from '../models/request/job-application.request';
import { JobApplicationService } from '../services/job-application.service';
import { ToastService } from '../services/toast.service';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';

@Component({
  selector: 'app-application-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './application-component.html',
  styleUrl: './application-component.css'
})
export class ApplicationComponent implements OnInit {
  submitted = false;
  mode: 'create' | 'view' | 'edit' = 'create';

  formData = {
    companyName: '',
    jobTitle: '',
    referenceUrl: '',
    appliedDate: '',
    status: '',
    notes: '',
    jobDescription: '',
    recruiterName: '',
    recruiterEmail: ''
  };

  apiCallInProgress: boolean = false;
  isApplicationFetching: boolean = false;
  isUpdateCallInProgress: boolean = false;
  applicationId: string | null = null; // Track loaded application

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Check route for application id
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.mode = 'view';
        this.applicationId = id;
        this.loadApplication(id);
      } else {
        this.mode = 'create';
        const today = new Date();
        this.formData.appliedDate = today.toISOString().split('T')[0];
      }
    });
  }

  loadApplication(id: string): void {
    this.apiCallInProgress = true;
    this.isApplicationFetching = true;
    this.jobApplicationService.getJobApplicationById(id).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          const jobApplication = response.data[0];
          console.log('Loaded application:', jobApplication);
          this.formData = {
            companyName: jobApplication.company,
            jobTitle: jobApplication.title,
            referenceUrl: jobApplication.ref_url,
            appliedDate: new Date().toISOString().split('T')[0],
            status: jobApplication.status,
            notes: jobApplication.notes,
            jobDescription: jobApplication.job_description,
            recruiterName: jobApplication.recruiter_info?.name,
            recruiterEmail: jobApplication.recruiter_info?.email
          };
        }
        this.apiCallInProgress = false;
        this.isApplicationFetching = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.apiCallInProgress = false;
        this.isApplicationFetching = false;
        this.toastService.showError('Failed to load application', 2000);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.isFormValid()) {
      this.toastService.showError('Some Fields are missing!', 2000);
      return;
    }
    const newApplication: JobApplicationRequest = {
      company: this.formData.companyName,
      title: this.formData.jobTitle,
      ref_url: this.formData.referenceUrl,
      status: this.formData.status,
      applied_date: Date.parse(this.formData.appliedDate),
      notes: this.formData.notes,
      job_description: this.formData.jobDescription,
      recruiter_info: {
        name: this.formData.recruiterName,
        email: this.formData.recruiterEmail,
        phone: ''
      }
    }
    this.saveApplication(newApplication);
  }

  onUpdate(): void {
    if (!this.isFormValid()) {
      this.toastService.showError('Some Fields are missing!', 2000);
      return;
    }
    const updatedApplication: JobApplicationRequest = {
      company: this.formData.companyName,
      title: this.formData.jobTitle,
      ref_url: this.formData.referenceUrl,
      status: this.formData.status,
      applied_date: Date.parse(this.formData.appliedDate),
      notes: this.formData.notes,
      job_description: this.formData.jobDescription,
      recruiter_info: {
        name: this.formData.recruiterName,
        email: this.formData.recruiterEmail,
        phone: ''
      }
    }
    this.apiCallInProgress = true;
    this.isUpdateCallInProgress = true;
    this.jobApplicationService.updateJobApplication(this.applicationId!, updatedApplication).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.toastService.showSuccess('Application updated successfully!', 2000);
          this.mode = 'view';
          this.apiCallInProgress = false;
          this.isUpdateCallInProgress = false;
          this.cdr.markForCheck();
        } else {
          this.toastService.showError('Failed to update application', 2000);
          this.apiCallInProgress = false;
          this.isUpdateCallInProgress = false;
        }
      },
      error: () => {
        this.toastService.showError('Failed to update application', 2000);
        this.apiCallInProgress = false;
      }
    });
  }

  onEdit(): void {
    this.mode = 'edit';
  }

  onCancelEdit(): void {
    this.mode = 'view';
    if (this.applicationId) {
      this.loadApplication(this.applicationId);
    }
  }

  saveDraft(): void {
    // Save as draft without validation
    const draftApplication = {
      id: this.generateId(),
      ...this.formData,
      isDraft: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save draft
    this.saveDraftApplication(draftApplication);
  }

  navigateToDashboard(): void {
    // Navigate back to dashboard
    this.router.navigate(['/dashboard']);
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.companyName &&
      this.formData.jobTitle &&
      this.formData.appliedDate &&
      this.formData.status
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveApplication(application: JobApplicationRequest): void {
    this.apiCallInProgress = true;
    console.log('Saving application:', application);
    this.jobApplicationService.addJobApplication(application).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.resetForm();
          this.toastService.showSuccess('Application saved successfully!', 2000);
          console.log('Application saved:', response.data);
          this.apiCallInProgress = false;
          this.navigateToDashboard();
          this.cdr.markForCheck();
        } else {
          console.error('Error saving application:', response.message);
          this.apiCallInProgress = false;
        }
      },
      error: (error) => {
        console.error('Error saving application:', error);
        alert('Failed to save application. Please try again later.');
      }
    });

  }

  private saveDraftApplication(draft: any): void {
    // In a real application, this would save to drafts
    console.log('Saving draft:', draft);

    // Simulate API call
    setTimeout(() => {
      this.showSuccessMessage('Draft saved successfully!');
    }, 500);
  }

  private showSuccessMessage(message: string): void {
    // In a real application, you would use a toast notification service
    alert(message);
  }

  private resetForm(): void {
    this.formData = {
      companyName: '',
      jobTitle: '',
      referenceUrl: '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: '',
      notes: '',
      jobDescription: '',
      recruiterName: '',
      recruiterEmail: ''
    };
    this.submitted = false;
  }

  // Helper method to get status badge color
  getStatusColor(status: string): string {
    const colors = {
      'applied': 'bg-slate-100 text-slate-700',
      'inReview': 'bg-blue-100 text-blue-700',
      'interview': 'bg-yellow-100 text-yellow-700',
      'offer': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  }

  // Method to validate URL format
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isEditMode(): boolean {
    return this.mode === 'edit';
  }

  isViewMode(): boolean {
    return this.mode === 'view';
  }
}

