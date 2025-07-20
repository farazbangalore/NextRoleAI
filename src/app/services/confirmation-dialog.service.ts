import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationDialogConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    icon?: string;
    data?: any;
}

export interface ConfirmationDialogResult {
    confirmed: boolean;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmationDialogService {
    private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
    private dialogConfigSubject = new BehaviorSubject<ConfirmationDialogConfig | null>(null);
    private dialogResultSubject = new BehaviorSubject<ConfirmationDialogResult | null>(null);

    public dialogVisible$ = this.dialogVisibleSubject.asObservable();
    public dialogConfig$ = this.dialogConfigSubject.asObservable();

    constructor() { }

    // Show confirmation dialog
    confirm(config: ConfirmationDialogConfig): Promise<boolean> {
        return new Promise((resolve) => {
            // Set default values
            const dialogConfig: ConfirmationDialogConfig = {
                confirmText: 'Confirm',
                cancelText: 'Cancel',
                type: 'info',
                ...config
            };

            this.dialogConfigSubject.next(dialogConfig);
            this.dialogVisibleSubject.next(true);

            // Wait for result
            const subscription = this.dialogResultSubject.subscribe(result => {
                if (result !== null) {
                    subscription.unsubscribe();
                    this.closeDialog();
                    resolve(result.confirmed);
                }
            });
        });
    }

    // Confirm action
    confirmAction(data?: any): void {
        this.dialogResultSubject.next({ confirmed: true, data });
    }

    // Cancel action
    cancelAction(): void {
        this.dialogResultSubject.next({ confirmed: false });
    }

    // Close dialog
    closeDialog(): void {
        this.dialogVisibleSubject.next(false);
        this.dialogConfigSubject.next(null);
        this.dialogResultSubject.next(null);
    }
}
