// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    public toasts$ = this.toastsSubject.asObservable();

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    showToast(message: string, type: Toast['type'], duration: number = 5000) {
        const toast: Toast = {
            id: this.generateId(),
            message,
            type,
            duration
        };

        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts, toast]);

        // Auto remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toast.id);
            }, duration);
        }
    }

    removeToast(id: string) {
        const currentToasts = this.toastsSubject.value;
        const filteredToasts = currentToasts.filter(toast => toast.id !== id);
        this.toastsSubject.next(filteredToasts);
    }

    // Convenience methods
    showSuccess(message: string, duration?: number) {
        this.showToast(message, 'success', duration);
    }

    showError(message: string, duration?: number) {
        this.showToast(message, 'error', duration);
    }

    showInfo(message: string, duration?: number) {
        this.showToast(message, 'info', duration);
    }

    showWarning(message: string, duration?: number) {
        this.showToast(message, 'warning', duration);
    }

    clearAll() {
        this.toastsSubject.next([]);
    }
}
