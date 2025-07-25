import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ResumeService } from '../services/resume.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-builder-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './resume-builder-component.html',
  styleUrl: './resume-builder-component.css'
})
export class ResumeBuilderComponent implements OnInit {
  isEditMode = false;
  resumeId: string | null = null;
  isLoadingData = false;
  isLoading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  
  // File upload
  uploadedFile: File | null = null;
  existingFile: { name: string; url: string } | null = null;
  isDragOver = false;

  formData = {
    name: '',
    reference_url: '',
    description: '',
    is_default: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.resumeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.resumeId;
    
    if (this.isEditMode) {
      this.loadResumeData();
    }
  }

  private loadResumeData(): void {
    if (!this.resumeId) return;

    this.isLoadingData = true;
    this.clearMessages();

    // Simulate API call - replace with actual service call
    setTimeout(() => {
      // Mock data for editing
      const mockResume = {
        id: this.resumeId,
        name: 'Software Engineer Resume',
        template: 'modern',
        reference_url: 'https://docs.google.com/document/d/example',
        description: 'My primary software engineering resume template',
        is_default: true
      };

      this.formData = { ...mockResume };
      this.existingFile = {
        name: 'software_engineer_resume.pdf',
        url: '/api/resumes/download/' + this.resumeId
      };
      this.isLoadingData = false;
    }, 800);

    // Uncomment when API is ready:
    // this.resumeService.getBaseResumeById(this.resumeId).subscribe({
    //   next: (resume) => {
    //     this.populateForm(resume);
    //     this.isLoadingData = false;
    //   },
    //   error: (error) => {
    //     this.errorMessage = error;
    //     this.isLoadingData = false;
    //   }
    // });
  }

  // File Upload Handlers
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    this.handleFileSelection(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    this.handleFileSelection(file);
  }

  private handleFileSelection(file: File | undefined): void {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Please upload a PDF, DOC, or DOCX file';
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'File size must be less than 10MB';
      return;
    }

    this.uploadedFile = file;
    this.clearMessages();
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.uploadedFile = null;
  }

  downloadExistingFile(): void {
    if (this.existingFile) {
      window.open(this.existingFile.url, '_blank');
    }
  }

  // Form Submission
  onSubmit(): void {
    this.saveResume();
  }

  saveResume(): void {
    this.submitted = true;
    this.clearMessages();

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields and upload a resume file';
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      this.updateResume();
    } else {
      this.createResume();
    }
  }

  private createResume(): void {
    // Simulate API call with file upload
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('reference_url', this.formData.reference_url);
    formData.append('description', this.formData.description);
    formData.append('is_default', this.formData.is_default.toString());
    if (this.uploadedFile) {
      formData.append('resume_file', this.uploadedFile);
    }

    // Simulate API call
    setTimeout(() => {
      this.successMessage = 'Resume created successfully!';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/resume']);
      }, 2000);
    }, 1500);

    // Uncomment when API is ready:
    // this.resumeService.createBaseResume(formData).subscribe({
    //   next: (resume) => {
    //     this.successMessage = 'Resume created successfully!';
    //     this.isLoading = false;
    //     setTimeout(() => {
    //       this.router.navigate(['/resume']);
    //     }, 2000);
    //   },
    //   error: (error) => {
    //     this.errorMessage = error;
    //     this.isLoading = false;
    //   }
    // });
  }

  private updateResume(): void {
    if (!this.resumeId) return;

    // Simulate API call
    setTimeout(() => {
      this.successMessage = 'Resume updated successfully!';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/resume']);
      }, 2000);
    }, 1500);

    // Uncomment when API is ready:
    // this.resumeService.updateBaseResume(this.resumeId, formData).subscribe({
    //   next: (resume) => {
    //     this.successMessage = 'Resume updated successfully!';
    //     this.isLoading = false;
    //     setTimeout(() => {
    //       this.router.navigate(['/resume']);
    //     }, 2000);
    //   },
    //   error: (error) => {
    //     this.errorMessage = error;
    //     this.isLoading = false;
    //   }
    // });
  }

  saveDraft(): void {
    this.isLoading = true;
    this.clearMessages();

    // Simulate saving draft
    setTimeout(() => {
      this.successMessage = 'Draft saved successfully!';
      this.isLoading = false;
      setTimeout(() => this.clearMessages(), 3000);
    }, 800);
  }

  // Utility Methods
  isFormValid(): boolean {
    return !!(
      this.formData.name &&
      (this.uploadedFile || this.existingFile)
    );
  }

  getUrlType(): string {
    if (!this.formData.reference_url) return '';
    
    const url = this.formData.reference_url.toLowerCase();
    if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
      return 'google';
    } else if (url.includes('overleaf.com')) {
      return 'overleaf';
    }
    return 'other';
  }

  getUrlTypeClass(): string {
    const type = this.getUrlType();
    switch (type) {
      case 'google':
        return 'bg-blue-500';
      case 'overleaf':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  }

  getUrlTypeLabel(): string {
    const type = this.getUrlType();
    switch (type) {
      case 'google':
        return 'Google Docs/Drive';
      case 'overleaf':
        return 'Overleaf Project';
      default:
        return 'External Link';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  goBack(): void {
    this.router.navigate(['/resume']);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}