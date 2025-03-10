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
    template: `
        <div class="auth-container">
            <div class="auth-content">
                <div class="auth-header">
                    <img src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg"
                         alt="Stack Overflow"
                         class="auth-logo" />

                </div>

                <div class="auth-tabs">
                    <button [class.active]="!isSignUp" (click)="isSignUp = false">Log in</button>
                    <button [class.active]="isSignUp" (click)="isSignUp = true">Sign up</button>
                </div>

                <!-- Sign In Form -->
                <form *ngIf="!isSignUp" class="auth-form" (ngSubmit)="onSignIn()">
                    <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" [(ngModel)]="signInForm.email" name="email" required>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Password</mat-label>
                        <input matInput [type]="hidePassword ? 'password' : 'text'"
                               [(ngModel)]="signInForm.password"
                               name="password"
                               required>
                        <button mat-icon-button matSuffix
                                (click)="hidePassword = !hidePassword"
                                type="button">
                            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                    </mat-form-field>

                    <button mat-flat-button color="primary" type="submit" class="submit-btn">
                        Log in
                    </button>
                </form>

                <!-- Sign Up Form -->
                <form *ngIf="isSignUp" class="auth-form" (ngSubmit)="onSignUp()">
                    <mat-form-field appearance="outline">
                        <mat-label>Display Name</mat-label>
                        <input matInput [(ngModel)]="signUpForm.name" name="name" required>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" [(ngModel)]="signUpForm.email" name="email" required>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="password-field" [class.mat-focused]="passwordField.focused">
                        <mat-label>Password</mat-label>
                        <input #passwordField="matInput"
                               matInput
                               [type]="hidePassword ? 'password' : 'text'"
                               [(ngModel)]="signUpForm.password"
                               name="password"
                               required>
                        <button mat-icon-button matSuffix
                                (click)="hidePassword = !hidePassword"
                                type="button">
                            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                        <mat-hint *ngIf="passwordField.focused">Passwords must contain at least eight characters, including at least 1 letter and 1 number.</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Confirm Password</mat-label>
                        <input matInput [type]="hidePassword ? 'password' : 'text'"
                               [(ngModel)]="signUpForm.confirmPassword"
                               name="confirmPassword"
                               required>
                    </mat-form-field>

                    <button mat-flat-button color="primary" type="submit" class="submit-btn">
                        Sign up
                    </button>
                </form>

                <div class="auth-footer">
                    <p *ngIf="!isSignUp">
                        Don't have an account?
                        <button mat-button color="primary" (click)="isSignUp = true">Sign up</button>
                    </p>
                    <p *ngIf="isSignUp">
                        Already have an account?
                        <button mat-button color="primary" (click)="isSignUp = false">Log in</button>
                    </p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .auth-container {
            max-width: 100%;
            min-height: calc(100vh - 50px);
            background-color: var(--so-background);
            padding: 24px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .auth-content {
            width: 100%;
            max-width: 316px;
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: var(--so-box-shadow);
        }

        .auth-header {
            text-align: center;
            margin-bottom: 24px;

            .auth-logo {
                width: 200px;
                margin-bottom: 24px;
            }
        }



        .auth-tabs {
            display: flex;
            margin: 16px 0;
            border-bottom: 1px solid var(--so-border-color);

            button {
                flex: 1;
              font-family: Montserrat,serif;
                background: none;
                border: none;
                padding: 8px;
                font-size: 13px;
                color: var(--so-gray);
                cursor: pointer;
                position: relative;

                &.active {
                    color: var(--so-green);

                    font-weight: 500;

                    &:after {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background-color: var(--so-orange);
                    }
                }

                &:hover:not(.active) {
                    background-color: var(--so-background);
                }
            }
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 16px;

            mat-form-field {
                width: 100%;
                color: var(--so-black);

                ::ng-deep {
                    .mat-mdc-text-field-wrapper {
                        background-color: white;
                    }

                    .mat-mdc-form-field-flex {
                        background-color: white;
                    }

                    .mdc-text-field--outlined {
                        --mdc-theme-text-primary-on-background: var(--so-black);
                    }

                    input.mat-mdc-input-element {
                        color: var(--so-black) !important;
                    }

                    .mat-mdc-form-field-label {
                        color: var(--so-black) !important;
                    }

                    .mdc-floating-label--float-above {
                        color: var(--so-black) !important;
                    }

                    .mdc-floating-label {
                        color: var(--so-black) !important;
                    }

                    .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
                        color: var(--so-black) !important;
                    }

                    .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
                        color: var(--so-black) !important;
                    }

                    .mdc-notched-outline__leading,
                    .mdc-notched-outline__notch,
                    .mdc-notched-outline__trailing {
                        border-color: var(--so-border-color) !important;
                    }

                    &.mat-focused {
                        .mdc-notched-outline__leading,
                        .mdc-notched-outline__notch,
                        .mdc-notched-outline__trailing {
                            border-color: var(--so-link-hover) !important;
                        }

                        .mat-mdc-form-field-label {
                            color: var(--so-gray) !important;
                        }

                        .mdc-floating-label {
                            color: var(--so-gray) !important;
                        }
                    }

                    .mat-mdc-form-field-required-marker {
                        color: var(--so-red);
                    }
                }

                // Add margin below password field when hint is shown
                &.password-field {
                    margin-bottom: -8px;

                    &.mat-focused {
                        margin-bottom: 30px;
                    }
                }
            }

            .submit-btn {
                background-color: var(--so-link-hover);
                color: white;
                height: 38px;
                margin-top: 8px;

                &:hover {
                    background-color: var(--so-link-color);
                }
            }
        }

        .auth-footer {
            margin-top: 24px;
            text-align: center;
            font-size: 13px;
            color: var(--so-gray);

            button {
                color: var(--so-link-color);
                font-size: 13px;

                &:hover {
                    color: var(--so-link-hover);
                }
            }
        }

        ::ng-deep {
            .mat-mdc-form-field {
                font-size: 15px;
            }

            .mat-mdc-form-field-subscript-wrapper {
                height: 17px;
            }

            .mat-mdc-form-field-hint {
                font-size: 11px;
                color: var(--so-gray);
            }

            .mdc-text-field--outlined {
                --mdc-theme-text-primary-on-background: var(--so-gray);
            }

            input.mat-mdc-input-element {
                color: var(--so-gray) !important;
            }

            .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
                color: var(--so-gray) !important;
            }

            .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
                color: var(--so-gray) !important;
            }
        }
    `]
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
