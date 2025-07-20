import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation-component/navigation-component';
import { AuthService } from './services/auth.service';
import { ToastComponent } from "./toast-component/toast-component";
import { ConfirmationDialogComponent } from './confirmation-dialog-component/confirmation-dialog-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, ToastComponent, ConfirmationDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private authService: AuthService) {
  }
  protected readonly title = signal('next-role-ai');
  ngOnInit() {
    this.authService.validateTokenOnAppLoad(); // 🔥 now it’s safe
  }
}
