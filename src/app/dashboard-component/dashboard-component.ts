import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from '../models/api.response';
import { JobApplicationDto } from '../models/dto/job-application.dto';
import { UserMetadata } from '../models/user_metadata';
import { AuthService } from '../services/auth.service';
import { JobApplicationService } from '../services/job-application.service';
import { ToastService } from '../services/toast.service';
import e from 'express';


interface Application {
  id: string;
  position: string;
  company: string;
  appliedDate: string;
  interviewDate?: string;
  offerDate?: string;
  status: 'applied' | 'inReview' | 'interview' | 'offer' | 'rejected';
}

interface Activity {
  id: string;
  message: string;
  time: string;
}

interface Interview {
  id: string;
  position: string;
  company: string;
  date: string;
  time: string;
}


@Component({
  selector: 'app-dashboard-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})

export class DashboardComponent implements OnInit {
  userName: any = 'Guest User';
  currentUser: UserMetadata | null = null;
  jobApplications: JobApplicationDto[] = [];
  isApplicationFetching = false;
  isApplicationStatusUpdating = false;
  applicationStatusMap: { [key: string]: JobApplicationDto[] } = {};
  currentContainerUnderDrop: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private jobApplicationService: JobApplicationService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  stats = {
    activeApplications: 0,
    interviews: 0,
    atsScore: 0,
    responseRate: 0
  };


  recentActivity: Activity[] = [
    {
      id: '1',
      message: 'Applied to Senior Frontend Developer at TechCorp',
      time: '2 hours ago'
    },
    {
      id: '2',
      message: 'Interview scheduled with CloudTech for tomorrow',
      time: '4 hours ago'
    },
    {
      id: '3',
      message: 'Resume optimized for Full Stack Engineer position',
      time: '1 day ago'
    },
    {
      id: '4',
      message: 'Received offer from MegaCorp',
      time: '1 day ago'
    },
    {
      id: '5',
      message: 'ATS score improved to 95% for React Developer application',
      time: '2 days ago'
    }
  ];

  upcomingInterviews: Interview[] = [
    {
      id: '1',
      position: 'Senior Developer',
      company: 'CloudTech',
      date: 'Tomorrow',
      time: '2:00 PM'
    },
    {
      id: '2',
      position: 'Tech Lead',
      company: 'InnovateNow',
      date: 'Friday',
      time: '10:00 AM'
    },
    {
      id: '3',
      position: 'Frontend Architect',
      company: 'DesignPro',
      date: 'Next Monday',
      time: '3:30 PM'
    }
  ];


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userName = this.currentUser ? this.currentUser.first_name : 'Guest User';
    this.loadJobApplications();
  }

  loadJobApplications(): void {
    this.isApplicationFetching = true;
    console.log('Loading user dashboard data...');
    this.jobApplicationService.getJobApplications()
      .subscribe({
        next: (response: ApiResponse) => {
          this.jobApplications = response.data as JobApplicationDto[];
          this.isApplicationFetching = false;
          this.buildApplicationStatusMap();
          this.refreshStats();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isApplicationFetching = false;
        }
      });
  }

  buildApplicationStatusMap(): void {
    this.applicationStatusMap = this.jobApplications.reduce(
      (acc, job) => {
        if (!acc[job.status]) {
          acc[job.status] = [];
        }
        acc[job.status].push(job);
        return acc;
      },
      {} as Record<string, JobApplicationDto[]>
    );
  }

  refreshStats(): void {
    this.stats.activeApplications = this.jobApplications.length;
    this.stats.interviews = this.applicationStatusMap['interview'] ? this.applicationStatusMap['interview'].length : 0;
  }

  addNewApplication(): void {
    // Navigate to add application form
    console.log('Navigate to add application form');
  }

  optimizeResume(): void {
    // Navigate to resume optimization
    console.log('Navigate to resume optimization');
  }

  importJobs(): void {
    // Navigate to job import functionality
    console.log('Navigate to job import');
  }

  viewApplication(application: JobApplicationDto): void {
    console.log('Viewing application:', application);
    this.router.navigate([`/application/${application.id}`]);
  }

  viewInterviewDetails(interviewId: string): void {
    // Navigate to interview details
    console.log('View interview details:', interviewId);
  }

  performNavigation(route: string): void {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
    // Implement navigation logic here, e.g., using Angular Router
  }


  onCardDrop(event: CdkDragDrop<any[]>, targetStatus: string) {
    this.currentContainerUnderDrop = event.container.id;

    if (event.container.id == event.previousContainer.id) {
      return;
    }
    const applicationId = event.previousContainer.data[event.previousIndex].id
    // Remove from old and add to new
    if (event.previousContainer.data == undefined) {
      event.previousContainer.data = [];
    }
    if (event.container.data == undefined) {
      event.container.data = [];
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    // Call your backend update method
    this.updateApplicationStatus(applicationId, targetStatus);
  }

  updateApplicationStatus(applicationId: string, newStatus: string) {
    this.isApplicationStatusUpdating = true;
    this.jobApplicationService.updateJobApplicationStatus(applicationId, newStatus)
      .subscribe({
        next: (response: ApiResponse) => {
          this.jobApplications = response.data as JobApplicationDto[];
          this.isApplicationFetching = false;
          this.loadJobApplications()
          this.isApplicationStatusUpdating = false;
          this.toastService.showSuccess(`Application moved Successfully`);
          this.currentContainerUnderDrop = null;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isApplicationFetching = false;
          this.isApplicationStatusUpdating = false;
          this.currentContainerUnderDrop = null;
          this.cdr.markForCheck();

        }
      });
  }

  isApplicationStatusMapEmpty(): boolean {
    return Object.keys(this.applicationStatusMap).length === 0;
  }
}
