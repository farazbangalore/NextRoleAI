// src/app/components/toast/toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(
      toasts => this.toasts = toasts
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(id: string) {
    this.toastService.removeToast(id);
  }

  getToastClasses(type: string): string {
    const baseClasses = 'border-l-4';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-400 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400 text-gray-800`;
    }
  }
}
