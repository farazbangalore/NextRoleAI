import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-application-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './application-component.html',
  styleUrl: './application-component.css'
})
export class ApplicationComponent implements OnInit {
  submitted = false;

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Set default applied date to today
    const today = new Date();
    this.formData.appliedDate = today.toISOString().split('T')[0];
  }

  onSubmit(): void {
    this.submitted = true;

    // Validate required fields
    if (!this.isFormValid()) {
      return;
    }

    // Create application object
    const newApplication = {
      id: this.generateId(),
      companyName: this.formData.companyName,
      jobTitle: this.formData.jobTitle,
      referenceUrl: this.formData.referenceUrl,
      appliedDate: this.formData.appliedDate,
      status: this.formData.status,
      notes: this.formData.notes,
      jobDescription: this.formData.jobDescription,
      recruiterName: this.formData.recruiterName,
      recruiterEmail: this.formData.recruiterEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save application
    this.saveApplication(newApplication);
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

  goBack(): void {
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

  private saveApplication(application: any): void {
    // In a real application, this would call your API service
    console.log('Saving application:', application);

    // Simulate API call
    setTimeout(() => {
      this.showSuccessMessage('Application added successfully!');
      this.resetForm();

      // Navigate back to dashboard after short delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }, 1000);
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
}
