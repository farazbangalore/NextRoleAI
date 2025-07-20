import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobApplicationDto } from '../models/dto/job-application.dto';
import { JobApplicationService } from '../services/job-application.service';
import { ApplicationFilters } from '../models/util/job-application.filter';
import { ApiResponse } from '../models/api.response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-landing-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './application-landing-component.html',
  styleUrl: './application-landing-component.css'
})
export class ApplicationLandingComponent implements OnInit, OnDestroy {
  applications: JobApplicationDto[] = [];
  filteredApplications: JobApplicationDto[] = [];
  isLoading = true;
  activeApplicationMenu: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  // Filters
  filters: ApplicationFilters = {
    search: '',
    status: '',
    sortBy: 'appliedDate',
    sortOrder: 'desc'
  };

  // Stats
  totalApplications = 0;
  statusCounts = {
    applied: 0,
    inReview: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  };

  private applicationsSubscription!: Subscription;

  constructor(
    private jobApplicationService: JobApplicationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  ngOnDestroy(): void {
    if (this.applicationsSubscription) {
      this.applicationsSubscription.unsubscribe();
    }
  }

  loadApplications(): void {
    this.isLoading = true;

    this.jobApplicationService.getJobApplications()
      .subscribe({
        next: (response: ApiResponse) => {
          this.applications = response.data as JobApplicationDto[];
          this.applyFilters();
          this.calculateStats();
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isLoading = false;
        }
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.applications];

    // Search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(searchTerm) ||
        app.title.toLowerCase().includes(searchTerm) ||
        (app.notes && app.notes.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (this.filters.status) {
      filtered = filtered.filter(app => app.status === this.filters.status);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.filters.sortBy) {
        case 'companyName':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'jobTitle':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.applied_date);
          bValue = new Date(b.applied_date);
      }

      if (aValue < bValue) return this.filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredApplications = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredApplications = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      status: '',
      sortBy: 'appliedDate',
      sortOrder: 'desc'
    };
    this.onFilterChange();
  }

  calculateStats(): void {
    this.totalApplications = this.applications.length;
    this.statusCounts = {
      applied: this.applications.filter(app => app.status === 'applied').length,
      inReview: this.applications.filter(app => app.status === 'inReview').length,
      interview: this.applications.filter(app => app.status === 'interview').length,
      offer: this.applications.filter(app => app.status === 'offer').length,
      rejected: this.applications.filter(app => app.status === 'rejected').length
    };
  }

  // UI Helper Methods
  getStatusLabel(status: string): string {
    const labels = {
      'applied': 'Applied',
      'inReview': 'In Review',
      'interview': 'Interview',
      'offer': 'Offer',
      'rejected': 'Rejected'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'applied': 'bg-slate-100 text-slate-700',
      'inReview': 'bg-blue-100 text-blue-700',
      'interview': 'bg-yellow-100 text-yellow-700',
      'offer': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700';
  }

  getATSScoreClass(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  getATSScoreBarClass(score: number): string {
    if (score >= 90) return 'bg-green-500';
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

  // Action Methods
  toggleApplicationMenu(applicationId: string): void {
    this.activeApplicationMenu = this.activeApplicationMenu === applicationId ? null : applicationId;
  }

  viewApplication(application: JobApplicationDto): void {
    this.router.navigate(['/applications', application.id]);
  }

  editApplication(application: JobApplicationDto): void {
    this.router.navigate(['/applications', application.id, 'edit']);
  }

  openApplication(jobApplicationDto: JobApplicationDto): void {
    console.log('Navigating to:', jobApplicationDto.id);
    this.router.navigate([`/application/${jobApplicationDto.id}`]);
  }

  performNavigation(path: string): void {
    console.log('Navigating to:', path);
    this.router.navigate([path]);
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  // Pagination Methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  deleteApplication(application: JobApplicationDto): void {
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.activeApplicationMenu = null;
    }
  }
}
