import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ConfirmationDialogService, ConfirmationDialogConfig } from '../services/confirmation-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog-component',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './confirmation-dialog-component.html',
  styleUrl: './confirmation-dialog-component.css'
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  dialogVisible$: Observable<boolean>;
  dialogConfig$: Observable<ConfirmationDialogConfig | null>;

  private subscription = new Subscription();

  constructor(private confirmationService: ConfirmationDialogService) {
    this.dialogVisible$ = this.confirmationService.dialogVisible$;
    this.dialogConfig$ = this.confirmationService.dialogConfig$;
  }

  ngOnInit(): void {
    // Handle escape key
    this.subscription.add(
      this.dialogVisible$.subscribe(visible => {
        if (typeof document !== 'undefined') {
          if (visible) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = 'auto';
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    this.subscription.unsubscribe();
  }


  // Handle backdrop click
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  // Confirm action
  confirm(): void {
    this.confirmationService.confirmAction();
  }

  // Cancel action
  cancel(): void {
    this.confirmationService.cancelAction();
  }

  // Get header class based on type
  getHeaderClass(type?: string): string {
    const baseClass = 'bg-gradient-to-r ';
    switch (type) {
      case 'danger':
        return baseClass + 'from-red-600 to-red-700';
      case 'warning':
        return baseClass + 'from-yellow-500 to-orange-600';
      case 'success':
        return baseClass + 'from-green-600 to-emerald-600';
      case 'info':
      default:
        return baseClass + 'from-blue-600 to-purple-600';
    }
  }

  // Get icon container class based on type
  getIconContainerClass(type?: string): string {
    const baseClass = 'bg-white/20 backdrop-blur-sm ';
    return baseClass;
  }

  // Get confirm button class based on type
  getConfirmButtonClass(type?: string): string {
    const baseClass = 'text-white ';
    switch (type) {
      case 'danger':
        return baseClass + 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500';
      case 'warning':
        return baseClass + 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:ring-yellow-500';
      case 'success':
        return baseClass + 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-green-500';
      case 'info':
      default:
        return baseClass + 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500';
    }
  }
}