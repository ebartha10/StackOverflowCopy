import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterModule
    ],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    isSignUp = false;
    hidePassword = true;
    isLoading = false;

    signInForm = {
        email: '',
        password: ''
    };

    signUpForm = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    onSignIn() {
        if (!this.signInForm.email || !this.signInForm.password) {
            this.showError('Please fill in all fields');
            return;
        }

        this.isLoading = true;
        this.authService.login(this.signInForm).subscribe({
            next: () => {
                this.router.navigate(['/']);
                this.showSuccess('Successfully logged in');
            },
            error: (error) => {
                this.showError(error.error || 'An error occurred during login');
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    onSignUp() {
        if (!this.signUpForm.name || !this.signUpForm.email || !this.signUpForm.password || !this.signUpForm.confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (this.signUpForm.password !== this.signUpForm.confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        this.isLoading = true;
        const registerData = {
            email: this.signUpForm.email,
            password: this.signUpForm.password,
            username: this.signUpForm.name
        };

        this.authService.register(registerData).subscribe({
            next: () => {
                this.router.navigate(['/']);
                this.showSuccess('Successfully registered');
            },
            error: (error) => {
                this.showError(error.error || 'An error occurred during registration');
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    private showError(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }

    private showSuccess(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }
}
