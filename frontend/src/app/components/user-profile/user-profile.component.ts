import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule
    ],
    template: `
        <div class="profile-container">
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-info">
                    <div class="profile-avatar">
                        <img src="https://www.gravatar.com/avatar/placeholder?d=identicon" alt="User avatar">
                        @if (user.isAdmin) {
                            <div class="admin-badge">
                                <mat-icon>verified</mat-icon>
                                Admin
                            </div>
                        }
                    </div>
                    <div class="profile-details">
                        <h1>{{user.username}}</h1>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <div class="stat-value">{{user.reputation | number}}</div>
                                <div class="stat-label">reputation</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">{{user.questionsCount}}</div>
                                <div class="stat-label">questions</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">{{user.answersCount}}</div>
                                <div class="stat-label">answers</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                @if (isAdmin && !user.isAdmin) {
                    <button mat-flat-button 
                            [color]="user.isBanned ? 'primary' : 'warn'"
                            class="ban-button"
                            (click)="toggleBanStatus()">
                        <mat-icon>{{user.isBanned ? 'lock_open' : 'block'}}</mat-icon>
                        {{user.isBanned ? 'UNBAN USER' : 'BAN USER'}}
                    </button>
                }
            </div>

            <!-- Content Tabs -->
            <mat-divider></mat-divider>
            <mat-tab-group class="custom-tabs">
                <mat-tab label="Questions">
                    <div class="tab-content">
                        @for (question of user.questions; track question.id) {
                            <div class="activity-item">
                                <div class="vote-count">
                                    <span>{{question.votes}}</span>
                                    votes
                                </div>
                                <div class="item-details">
                                    <a [routerLink]="['/questions', question.id]" class="item-title">
                                        {{question.title}}
                                    </a>
                                    <div class="item-meta">
                                        asked {{question.createdAt | date:'MMM d, y'}}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </mat-tab>
                <mat-tab label="Answers">
                    <div class="tab-content">
                        @for (answer of user.answers; track answer.id) {
                            <div class="activity-item">
                                <div class="vote-count">
                                    <span>{{answer.votes}}</span>
                                    votes
                                </div>
                                <div class="item-details">
                                    <a [routerLink]="['/questions', answer.questionId]" class="item-title">
                                        {{answer.questionTitle}}
                                    </a>
                                    <div class="item-meta">
                                        answered {{answer.createdAt | date:'MMM d, y'}}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </mat-tab>
            </mat-tab-group>
        </div>
    `,
    styles: [`
        .profile-container {
            max-width: 1100px;
            margin: 24px auto;
            padding: 24px;
            background-color: white;
            border-radius: 8px;
            box-shadow: var(--so-box-shadow);
        }

        .profile-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .profile-info {
            display: flex;
            gap: 24px;
            align-items: flex-start;
        }

        .profile-avatar {
            position: relative;

            img {
                width: 128px;
                height: 128px;
                border-radius: 50%;
                border: 1px solid var(--so-border-color);
            }

            .admin-badge {
                position: absolute;
                bottom: -8px;
                right: -8px;
                background-color: var(--so-orange);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                
                mat-icon {
                    font-size: 16px;
                    width: 16px;
                    height: 16px;
                }
            }
        }

        .profile-details {
            h1 {
                font-family: var(--so-title-font);
                font-size: 34px;
                margin-bottom: 16px;
                color: var(--so-black);
            }
        }

        .profile-stats {
            display: flex;
            gap: 24px;

            .stat-item {
                .stat-value {
                    font-size: 21px;
                    font-weight: 500;
                    color: var(--so-black);
                }

                .stat-label {
                    font-size: 13px;
                    color: var(--so-gray);
                }
            }
        }

        .ban-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            font-weight: 500;

            mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
            }
        }

        .tab-content {
            padding: 24px 0;
        }

        .activity-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            border-bottom: 1px solid var(--so-border-color);

            &:last-child {
                border-bottom: none;
            }

            .vote-count {
                min-width: 80px;
                text-align: center;
                color: var(--so-gray);
                font-size: 13px;

                span {
                    display: block;
                    font-size: 21px;
                    font-weight: 500;
                    color: var(--so-black);
                }
            }

            .item-details {
                flex: 1;

                .item-title {
                    font-size: 17px;
                    color: var(--so-link-color);
                    text-decoration: none;
                    margin-bottom: 8px;
                    display: block;

                    &:hover {
                        color: var(--so-link-hover);
                    }
                }

                .item-meta {
                    font-size: 13px;
                    color: var(--so-gray);
                }
            }
        }

        .custom-tabs {
            ::ng-deep {
                .mat-mdc-tab-header {
                    --mdc-secondary-navigation-tab-container-height: 48px;
                }

                .mdc-tab {
                    height: 48px;
                }

                .mdc-tab__text-label {
                    color: var(--so-black) !important;
                    font-size: 15px;
                    font-weight: 500;
                }

                .mdc-tab-indicator__content--underline {
                    border-color: var(--so-orange) !important;
                }

                .mdc-tab--active .mdc-tab__text-label {
                    color: var(--so-black) !important;
                    font-weight: 600;
                }

                .mat-mdc-tab:not(.mat-mdc-tab-disabled).mdc-tab--active .mdc-tab__text-label {
                    color: var(--so-black) !important;
                }

                .mat-mdc-tab:not(.mat-mdc-tab-disabled) .mdc-tab__text-label {
                    color: var(--so-black) !important;
                }
            }
        }
    `]
})
export class UserProfileComponent implements OnInit {
    user = {
        id: 1,
        username: 'john_doe',
        reputation: 12345,
        questionsCount: 42,
        answersCount: 156,
        isBanned: false,
        isAdmin: true,
        questions: [
            {
                id: 1,
                title: 'How to center a div in CSS?',
                votes: 15,
                createdAt: new Date('2024-03-15')
            },
            {
                id: 2,
                title: 'Understanding async/await in TypeScript',
                votes: 8,
                createdAt: new Date('2024-03-10')
            }
        ],
        answers: [
            {
                id: 1,
                questionId: 3,
                questionTitle: 'Best practices for REST API design',
                votes: 23,
                createdAt: new Date('2024-03-12')
            },
            {
                id: 2,
                questionId: 4,
                questionTitle: 'Angular: How to share data between components?',
                votes: 12,
                createdAt: new Date('2024-03-08')
            }
        ]
    };

    isAdmin = true;
    currentUserId = 2;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        const userId = Number(this.route.snapshot.paramMap.get('id'));
        // TODO: Load user data from a service
    }

    toggleBanStatus() {
        this.user.isBanned = !this.user.isBanned;
        // TODO: Implement actual ban/unban logic with backend
        console.log(`User ${this.user.isBanned ? 'banned' : 'unbanned'}`);
    }
} 