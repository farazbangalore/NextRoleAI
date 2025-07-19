import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

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
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})

export class DashboardComponent implements OnInit {
  userName = 'John Doe';
  userInitials = 'JD';

  constructor(
    private router: Router,
  ) { }

  stats = {
    activeApplications: 24,
    interviews: 8,
    atsScore: 95,
    responseRate: 32
  };

  applications = {
    applied: [
      {
        id: '1',
        position: 'Senior Frontend Developer',
        company: 'TechCorp',
        appliedDate: '2 days ago',
        status: 'applied'
      },
      {
        id: '2',
        position: 'Full Stack Engineer',
        company: 'StartupXYZ',
        appliedDate: '1 week ago',
        status: 'applied'
      },
      {
        id: '3',
        position: 'React Developer',
        company: 'WebSolutions',
        appliedDate: '3 days ago',
        status: 'applied'
      }
    ] as Application[],
    inReview: [
      {
        id: '4',
        position: 'Software Engineer',
        company: 'BigTech Inc',
        appliedDate: '1 week ago',
        status: 'inReview'
      },
      {
        id: '5',
        position: 'Frontend Lead',
        company: 'DesignHub',
        appliedDate: '5 days ago',
        status: 'inReview'
      }
    ] as Application[],
    interview: [
      {
        id: '6',
        position: 'Senior Developer',
        company: 'CloudTech',
        appliedDate: '2 weeks ago',
        interviewDate: 'Tomorrow',
        status: 'interview'
      },
      {
        id: '7',
        position: 'Tech Lead',
        company: 'InnovateNow',
        appliedDate: '1 week ago',
        interviewDate: 'Friday',
        status: 'interview'
      }
    ] as Application[],
    offer: [
      {
        id: '8',
        position: 'Principal Engineer',
        company: 'MegaCorp',
        appliedDate: '3 weeks ago',
        offerDate: 'Yesterday',
        status: 'offer'
      }
    ] as Application[]
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
    this.loadUserData();
  }

  loadUserData(): void {
    // Simulate loading user data
    // In real implementation, this would call your API service
    console.log('Loading user dashboard data...');
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

  viewApplicationDetails(applicationId: string): void {
    // Navigate to application details
    console.log('View application details:', applicationId);
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
}
