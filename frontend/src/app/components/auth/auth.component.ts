import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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

    onSignIn() {
        console.log('Sign in:', this.signInForm);
        // TODO: Implement sign in logic
    }

    onSignUp() {
        console.log('Sign up:', this.signUpForm);
        // TODO: Implement sign up logic
    }
}
