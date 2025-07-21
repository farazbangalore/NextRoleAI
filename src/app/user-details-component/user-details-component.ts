import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetailsDto } from '../models/dto/user-details.dto';
import { ApiResponse } from '../models/api.response';
import { Education } from '../models/util/education';
import { Certification } from '../models/util/certification';
import { Experience } from '../models/util/experience';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  currentUserProfile: UserDetailsDto | null = null;
  editableProfile: UserDetailsDto = this.createEmptyProfile();
  isLoading = true;
  isFetchingProfile = false;
  isUpdatingProfile = false;
  isEditing = false;

  private profileSubscription!: Subscription;
  private months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private userProfileService: UserProfileService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  loadProfile(): void {
    this.isLoading = true;
    this.isFetchingProfile = true;
    this.userProfileService.getUserDetails()
      .subscribe({
        next: (response: ApiResponse) => {
          this.currentUserProfile = response.data as UserDetailsDto;
          this.editableProfile = this.deepClone(this.currentUserProfile);;
          this.isLoading = false;
          this.isFetchingProfile = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isLoading = false;
          this.isFetchingProfile = false;
        }
      });
  }

  toggleEditMode(): void {
    this.isEditing = true;
    this.editableProfile = this.deepClone(this.currentUserProfile!);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableProfile = this.deepClone(this.currentUserProfile!);
  }

  updateProfile(): void {
    this.isUpdatingProfile = true;
    this.userProfileService.updateUserProfile(this.editableProfile).subscribe({
      next: (updatedProfile: ApiResponse) => {
        this.currentUserProfile = updatedProfile.data as UserDetailsDto;
        this.isEditing = false;
        this.isUpdatingProfile = false;
        this.toastService.showSuccess('Profile updated successfully');
        this.loadProfile();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
        this.isUpdatingProfile = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editableProfile.photo_url = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload to server (uncomment when API is ready)
      // this.userProfileService.uploadProfilePhoto(file).subscribe({
      //   next: (photoUrl) => {
      //     this.editableProfile.photo_url = photoUrl;
      //   },
      //   error: (error) => {
      //     console.error('Error uploading photo:', error);
      //     alert('Failed to upload photo. Please try again.');
      //   }
      // });
    }
  }

  // Education methods
  addEducation(): void {
    const newEducation: Education = {
      id: this.editableProfile.education.length,
      institution_name: '',
      start_year: new Date().getFullYear(),
      course: '',
      score: 0
    };
    this.editableProfile.education.push(newEducation);
  }

  addCertification(): void {
    const newCertification: Certification = {
      id: this.editableProfile.certifications.length,
      name: '',
      issuing_organization: '',
      credential_url: '',
      issue_year: new Date().getFullYear(),
      issue_month: 1,
      expiry_year: undefined,
      expiry_month: undefined
    };
    this.editableProfile.certifications.push(newCertification);
  }

  removeCertification(index: number): void {
    this.editableProfile.certifications.splice(index, 1);
  }

  removeEducation(index: number): void {
    this.editableProfile.education.splice(index, 1);
  }

  // Experience methods
  addExperience(): void {
    const newExperience: Experience = {
      id: this.editableProfile.experience.length,
      company: '',
      title: '',
      start_year: new Date().getFullYear(),
      start_month: 1,
      Summary: ['']
    };
    this.editableProfile.experience.push(newExperience);
  }

  removeExperience(index: number): void {
    this.editableProfile.experience.splice(index, 1);
  }

  addSummaryPoint(experienceIndex: number): void {
    this.editableProfile.experience[experienceIndex].Summary.push('');
  }

  removeSummaryPoint(experienceIndex: number, summaryIndex: number): void {
    this.editableProfile.experience[experienceIndex].Summary.splice(summaryIndex, 1);
  }

  // Skills methods
  addTechnicalSkill(): void {
    if (!this.editableProfile.skills) {
      this.editableProfile.skills = { technical_skills: [], soft_skills: [] };
    }
    this.editableProfile.skills.technical_skills.push('');
  }

  removeTechnicalSkill(index: number): void {
    this.editableProfile.skills?.technical_skills.splice(index, 1);
  }

  addSoftSkill(): void {
    if (!this.editableProfile.skills) {
      this.editableProfile.skills = { technical_skills: [], soft_skills: [] };
    }
    this.editableProfile.skills.soft_skills.push('');
  }

  removeSoftSkill(index: number): void {
    this.editableProfile.skills?.soft_skills.splice(index, 1);
  }

  // Achievements methods
  addAchievement(): void {
    this.editableProfile.achievements.push('');
  }

  removeAchievement(index: number): void {
    this.editableProfile.achievements.splice(index, 1);
  }

  // Utility methods
  getInitials(): string {
    if (!this.currentUserProfile) return 'U';
    const firstName = this.currentUserProfile.first_name || '';
    const lastName = this.currentUserProfile.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  }

  getMonthName(monthNumber: number | undefined): string {
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) return '';
    return this.months[monthNumber - 1];
  }

  private createEmptyProfile(): UserDetailsDto {
    return {
      first_name: '',
      last_name: '',
      email: '',
      education: [],
      experience: [],
      skills: { technical_skills: [], soft_skills: [] },
      certifications: [],
      achievements: [],
      created_at: Date.now(),
      modified_at: Date.now()
    };
  }

  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
