import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/question.interface';
import { QuestionService } from '../../services/question.service';

@Component({
    selector: 'app-questions-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    template: `
        <div class="questions-container">
            <div class="questions-header">
                <div class="header-content">
                    <div class="title-section">
                        <h1>All Questions</h1>
                        <p class="text-so-gray">{{questions.length}} questions</p>
                    </div>
                    <div class="header-actions">
                        <button mat-stroked-button
                                [matMenuTriggerFor]="filterMenu"
                                class="filter-button">
                            <mat-icon>filter_list</mat-icon>
                            Filter by tags
                        </button>
                        <button mat-flat-button
                                color="primary"
                                class="ask-button"
                                routerLink="/questions/ask">
                            <mat-icon>add</mat-icon>
                            Ask Question
                        </button>

                        <!-- Filter Menu -->
                        <mat-menu #filterMenu="matMenu" class="filter-menu">
                            <div class="menu-content" (click)="$event.stopPropagation()">
                                <div class="search-tags">
                                    <mat-form-field appearance="outline" class="compact-form-field">
                                        <input matInput
                                               [(ngModel)]="tagSearch"
                                               (ngModelChange)="filterTags()"
                                               placeholder="Search tags">
                                        <mat-icon matSuffix class="search-icon">search</mat-icon>
                                    </mat-form-field>
                                </div>
                                <div class="tags-list">
                                    @for (tag of filteredTags; track tag) {
                                        <div class="tag-item"
                                             [class.selected]="selectedTags.includes(tag)"
                                             (click)="toggleTag(tag)">
                                            <span class="tag">{{tag}}</span>
                                            <mat-icon *ngIf="selectedTags.includes(tag)" class="check-icon">check</mat-icon>
                                        </div>
                                    }
                                </div>
                            </div>
                        </mat-menu>
                    </div>
                </div>
            </div>

            <div class="questions-list">
                @for (question of questions; track question.id) {
                    <div class="question-item">
                        <div class="question-summary">
                            <h3>
                                <a [routerLink]="['/questions', question.id]">{{question.title}}</a>
                            </h3>
                            <div class="excerpt">{{question.body}}</div>
                            <div class="flex justify-between items-end">
                                <div class="tags">
                                    @for (tag of question.tags; track tag) {
                                        <a [routerLink]="['/tags', tag]" class="tag">{{tag}}</a>
                                    }
                                </div>
                                <div class="meta">
                                    asked {{question.createdAt | date:'MMM d, y'}} by
                                    <a [routerLink]="['/users', question.author.id]">
                                        {{question.author.username}}
                                    </a>
                                    <span class="reputation">{{question.author.reputation | number}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats">
                            <div class="stat-item">
                                <div class="stat-content">
                                    <mat-icon class="stat-icon">arrow_upward</mat-icon>
                                    <span class="font-bold">{{question.votes}}</span>
                                </div>
                            </div>
                            <div class="stat-item" [class.answered]="question.answers > 0">
                                <div class="stat-content">
                                    <mat-icon class="stat-icon">question_answer</mat-icon>
                                    <span class="font-bold">{{question.answers}}</span>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-content">
                                    <mat-icon class="stat-icon">visibility</mat-icon>
                                    <span class="font-bold">{{question.views}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        .questions-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--so-border-color);

            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;

                .title-section {
                    h1 {
                        font-size: 27px;
                        margin-bottom: 8px;
                        font-family: var(--so-title-font);
                        font-weight: 600;
                        color: var(--so-black);
                        letter-spacing: -0.3px;
                    }
                }

                .header-actions {
                    display: flex;
                    gap: 8px;
                    align-items: center;

                    .filter-button {
                        height: 38px;
                        padding: 0 12px;
                        border-color: var(--so-border-color);
                        color: var(--so-gray-dark);
                        display: flex;
                        align-items: center;
                        gap: 4px;

                        mat-icon {
                            font-size: 18px;
                            width: 18px;
                            height: 18px;
                        }

                        &:hover {
                            background-color: var(--so-gray-light);
                        }
                    }

                    .ask-button {
                        background-color: var(--so-link-hover);
                        color: white;
                        height: 38px;
                        padding: 0 12px;
                        border-radius: 4px;
                        font-size: 13px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 4px;

                        mat-icon {
                            font-size: 18px;
                            width: 18px;
                            height: 18px;
                        }

                        &:hover {
                            background-color: var(--so-link-color);
                        }
                    }
                }
            }
        }

        .question-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 16px;
            border-bottom: 1px solid var(--so-border-color);
            gap: 16px;
        }

        .stats {
            display: flex;
            flex-direction: column;
            min-width: 120px;
            color: var(--so-gray);
            font-size: 13px;
            gap: 12px;

            .stat-item {
                display: flex;
                flex-direction: column;
                gap: 4px;

                &.answered {
                    color: var(--so-green);
                    .stat-icon {
                        color: var(--so-green);
                    }
                }

                .stat-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;

                    .stat-icon {
                        font-size: 18px;
                        width: 18px;
                        height: 18px;
                        color: var(--so-gray);
                    }

                    .font-bold {
                        min-width: 30px;
                        text-align: right;
                    }
                }

                .stat-label {
                    font-size: 12px;
                    text-align: right;
                }
            }
        }

        .question-summary {
            flex: 1;
            min-width: 0;

            h3 {
                margin-top: 0;
                margin-bottom: 8px;
            }

            .excerpt {
                margin-bottom: 12px;
                color: var(--so-gray-dark);
                line-height: 1.4;
            }
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 8px;
        }

        .meta {
            font-size: 12px;
            color: var(--so-gray);
        }

        ::ng-deep {
            .filter-menu {
                .mdc-menu-surface {
                    background-color: white !important;
                    border: 1px solid var(--so-border-color);
                    box-shadow: var(--so-box-shadow) !important;
                }

                .menu-content {
                    padding: 8px;
                    width: 250px;
                    max-height: 400px;
                    overflow-y: auto;
                    background-color: white;

                    .search-tags {
                        padding: 0 4px;
                        margin-bottom: 4px;

                        .compact-form-field {
                            width: 100%;

                            ::ng-deep {
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
                                .mat-mdc-form-field-flex {
                                    height: 36px;
                                }

                                .mat-mdc-form-field-infix {
                                    padding: 8px 0;
                                }

                                .mat-mdc-text-field-wrapper {
                                    padding: 0 8px;
                                    background-color: white;
                                }

                                input {
                                    font-size: 13px;
                                    color: var(--so-black);
                                }

                                .search-icon {
                                    color: var(--so-gray);
                                    font-size: 18px;
                                    width: 18px;
                                    height: 18px;
                                }
                            }
                        }
                    }

                    .tags-list {
                        display: flex;
                        flex-direction: column;

                        .tag-item {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 6px 8px;
                            cursor: pointer;
                            color: var(--so-black);
                            font-size: 13px;

                            &:hover {
                                background-color: var(--so-gray-light);
                            }

                            &.selected {
                                background-color: #e1ecf4;
                                color: var(--so-link-color);
                            }

                            .check-icon {
                                font-size: 16px;
                                width: 16px;
                                height: 16px;
                                color: var(--so-link-color);
                            }
                        }
                    }
                }
            }
        }
    `]
})
export class QuestionsListComponent implements OnInit {
    questions: Question[] = [];
    tagSearch: string = '';
    allTags: string[] = ['javascript', 'angular', 'typescript', 'css', 'html', 'react', 'node.js', 'python', 'java', 'c#'];
    filteredTags: string[] = this.allTags;
    selectedTags: string[] = [];

    constructor(private questionService: QuestionService) {}

    ngOnInit() {
        this.questionService.getQuestions().subscribe(questions => {
            this.questions = questions;
        });
    }

    filterTags() {
        if (!this.tagSearch.trim()) {
            this.filteredTags = this.allTags;
        } else {
            const search = this.tagSearch.toLowerCase();
            this.filteredTags = this.allTags.filter(tag =>
                tag.toLowerCase().includes(search)
            );
        }
    }

    toggleTag(tag: string) {
        const index = this.selectedTags.indexOf(tag);
        if (index === -1) {
            this.selectedTags.push(tag);
        } else {
            this.selectedTags.splice(index, 1);
        }
        // TODO: Implement filtering questions by selected tags
    }
}
