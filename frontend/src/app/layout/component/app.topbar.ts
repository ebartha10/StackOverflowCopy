import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule
    ],
    template: `
        <nav class="so-nav">
            <div class="container">
                <div class="nav-content">
                    <!-- Logo -->
                    <a class="flex-none" routerLink="/">
                        <img src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg"
                             alt="Stack Overflow"
                             class="nav-logo" />
                    </a>

                    <!-- Search -->
                    <div class="nav-search">
                        <div class="search-wrapper">
                            <mat-icon class="search-icon">search</mat-icon>
                            <input type="text" placeholder="Search..." class="search-input"/>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="nav-actions">
                        <button type="button" mat-icon-button [matMenuTriggerFor]="authMenu" class="auth-button">
                            <mat-icon class="centered-icon">person</mat-icon>
                        </button>

                        <!-- Auth Menu -->
                        <mat-menu #authMenu="matMenu" xPosition="before" class="auth-menu">
                            <!-- Show these items when user is logged in -->
                            <div class="menu-content">
                                <ng-container *ngIf="isLoggedIn">
                                    <a mat-menu-item routerLink="/profile">
                                        <mat-icon>account_circle</mat-icon>
                                        <span>Profile</span>
                                    </a>
                                    <button mat-menu-item (click)="onLogout()">
                                        <mat-icon>logout</mat-icon>
                                        <span>Log out</span>
                                    </button>
                                </ng-container>

                                <!-- Show these items when user is not logged in -->
                                <ng-container *ngIf="!isLoggedIn">
                                    <a mat-menu-item routerLink="/auth">
                                        <mat-icon>login</mat-icon>
                                        <span>Sign in</span>
                                    </a>
                                    <a mat-menu-item routerLink="/auth" [queryParams]="{signup: true}">
                                        <mat-icon>person_add</mat-icon>
                                        <span>Sign up</span>
                                    </a>
                                </ng-container>
                            </div>
                        </mat-menu>
                    </div>
                </div>
            </div>
        </nav>
    `,
    styles: [`
        :host {
            .nav-content {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                width: 100%;
            }

            .nav-logo {
                height: 30px;
                width: auto;
            }

            .nav-actions {
                display: flex;
                align-items: center;
                margin-left: auto;
                height: 100%;

                .auth-button {
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    color: var(--so-black);
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        background: var(--so-gray-light);
                    }

                    .centered-icon {
                        font-size: 20px;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }

            .nav-search {
                flex: 1;
                margin: 0 8px;
                max-width: 800px;

                .search-wrapper {
                    position: relative;
                    width: 100%;
                    height: 32px;
                    display: flex;
                    align-items: center;

                    .search-icon {
                        position: absolute;
                        left: 0.5em;
                        top: 50%;
                        transform: translateY(-50%);
                        color: var(--so-gray);
                        font-size: 20px;
                        width: 20px;
                        height: 20px;
                    }

                    .search-input {
                        width: 100%;
                        height: 100%;
                        padding: 7px 9px 7px 32px;
                        border: 1px solid var(--so-border-color);
                        border-radius: 3px;
                        font-size: 13px;
                        background-color: white;
                        color: var(--so-black);

                        &::placeholder {
                            color: var(--so-gray);
                        }

                        &:focus {
                            outline: none;
                            border-color: var(--so-link-hover);
                            box-shadow: 0 0 0 4px rgba(0,149,255,0.15);
                        }
                    }
                }
            }
        }

        ::ng-deep {
            .auth-menu {
                margin-top: 8px;

                .mat-mdc-menu-content {
                    padding: 8px 0;
                    background-color: white;
                }

                .mat-mdc-menu-item {
                    font-size: 13px;
                    height: 40px;
                    line-height: 40px;
                    color: var(--so-black);

                    .mat-icon {
                        margin-right: 8px;
                        font-size: 18px;
                        height: 18px;
                        width: 18px;
                        color: var(--so-gray);
                    }

                    &:hover {
                        background-color: var(--so-gray-light);
                        color: var(--so-black);

                        .mat-icon {
                            color: var(--so-black);
                        }
                    }
                }
            }

            .mdc-menu-surface {
                background-color: white !important;
                border: 1px solid var(--so-border-color);
                border-radius: 4px;
                box-shadow: var(--so-box-shadow) !important;
            }
        }
    `]
})
export class AppTopbar {
    isLoggedIn = false;

    onLogout() {
        console.log('Logging out...');
    }
}
