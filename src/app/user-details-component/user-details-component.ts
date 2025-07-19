import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfileService, UserProfile, Education, Experience, Skills } from '../services/user-profile.service';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  editableProfile: UserProfile = this.createEmptyProfile();
  isLoading = true;
  isEditing = false;

  private profileSubscription!: Subscription;
  private months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private userProfileService: UserProfileService) { }

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

    // Using mock data for development - replace with actual API call
    setTimeout(() => {
      this.profile = this.userProfileService.getMockProfile();
      this.editableProfile = this.deepClone(this.profile);
      this.isLoading = false;
    }, 500);

    // Uncomment when API is ready:
    // this.userProfileService.getUserProfile().subscribe({
    //   next: (profile) => {
    //     this.profile = profile;
    //     this.editableProfile = this.deepClone(profile);
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading profile:', error);
    //     this.isLoading = false;
    //   }
    // });
  }

  toggleEditMode(): void {
    this.isEditing = true;
    this.editableProfile = this.deepClone(this.profile!);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableProfile = this.deepClone(this.profile!);
  }

  saveProfile(): void {
    this.userProfileService.updateUserProfile(this.editableProfile).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
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
      institution_name: '',
      start_year: new Date().getFullYear(),
      course: '',
      score: 0
    };
    this.editableProfile.education.push(newEducation);
  }

  removeEducation(index: number): void {
    this.editableProfile.education.splice(index, 1);
  }

  // Experience methods
  addExperience(): void {
    const newExperience: Experience = {
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
    if (!this.profile) return 'U';
    const firstName = this.profile.first_name || '';
    const lastName = this.profile.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  }

  getMonthName(monthNumber: number | undefined): string {
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) return '';
    return this.months[monthNumber - 1];
  }

  private createEmptyProfile(): UserProfile {
    return {
      first_name: '',
      last_name: '',
      email: '',
      education: [],
      experience: [],
      skills: { technical_skills: [], soft_skills: [] },
      achievements: [],
      created_at: Date.now(),
      modified_at: Date.now()
    };
  }

  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
