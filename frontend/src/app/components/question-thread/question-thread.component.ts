import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.interface';

@Component({
    selector: 'app-question-thread',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
        <div class="thread-container" *ngIf="question">
            <!-- Question Section -->
            <div class="question-section">
                <div class="question-header">
                    <h1>{{question.title}}</h1>
                    <div class="question-meta">
                        Asked <span>{{question.createdAt | date:'MMM d, y'}}</span>
                        Modified <span>{{question.updatedAt | date:'MMM d, y'}}</span>
                        Viewed <span>{{question.views}} times</span>
                    </div>
                </div>

                <div class="post-layout">
                    <div class="vote-cell">
                        <button mat-icon-button>
                            <mat-icon>arrow_upward</mat-icon>
                        </button>
                        <div class="vote-count">{{question.votes}}</div>
                        <button mat-icon-button>
                            <mat-icon>arrow_downward</mat-icon>
                        </button>
                    </div>

                    <div class="post-content">
                        <!-- Question Body with Edit Mode -->
                        @if (isEditingQuestion) {
                            <mat-form-field appearance="outline" class="full-width">
                                <textarea matInput
                                         [(ngModel)]="editQuestionBody"
                                         rows="15"></textarea>
                            </mat-form-field>
                            <div class="edit-actions">
                                <button mat-stroked-button
                                        color="primary"
                                        (click)="saveQuestionEdit()">
                                    Save Edits
                                </button>
                                <button mat-stroked-button
                                        (click)="cancelQuestionEdit()">
                                    Cancel
                                </button>
                            </div>
                        } @else {
                            <div class="content-with-edit">
                                <div class="post-body">{{question.body}}</div>
                                <button mat-stroked-button
                                        class="edit-button"
                                        (click)="startQuestionEdit()">
                                    <mat-icon>edit</mat-icon>
                                    Edit
                                </button>
                            </div>
                        }

                        <div class="post-tags">
                            @for (tag of question.tags; track tag) {
                                <a [routerLink]="['/tags', tag]" class="tag">{{tag}}</a>
                            }
                        </div>
                        <div class="post-author">
                            <div class="author-info">
                                asked by
                                <a [routerLink]="['/users', question.author.id]">
                                    {{question.author.username}}
                                </a>
                                <div class="reputation">{{question.author.reputation | number}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Answers Section -->
            <div class="answers-section">
                <h2>{{question.answers}} Answers</h2>

                @for (answer of answers; track answer.id) {
                    <div class="answer-item">
                        <div class="post-layout">
                            <div class="vote-cell">
                                <button mat-icon-button>
                                    <mat-icon>arrow_upward</mat-icon>
                                </button>
                                <div class="vote-count">{{answer.votes}}</div>
                                <button mat-icon-button>
                                    <mat-icon>arrow_downward</mat-icon>
                                </button>
                            </div>

                            <div class="post-content">
                                <!-- Answer Body with Edit Mode -->
                                @if (editingAnswerId === answer.id) {
                                    <mat-form-field appearance="outline" class="full-width">
                                        <textarea matInput
                                                 [(ngModel)]="editAnswerBody"
                                                 rows="10"></textarea>
                                    </mat-form-field>
                                    <div class="edit-actions">
                                        <button mat-stroked-button
                                                color="primary"
                                                (click)="saveAnswerEdit(answer.id)">
                                            Save Edits
                                        </button>
                                        <button mat-stroked-button
                                                (click)="cancelAnswerEdit()">
                                            Cancel
                                        </button>
                                    </div>
                                } @else {
                                    <div class="content-with-edit">
                                        <div class="post-body">{{answer.body}}</div>
                                        <button mat-stroked-button
                                                class="edit-button"
                                                (click)="startAnswerEdit(answer)">
                                            <mat-icon>edit</mat-icon>
                                            Edit
                                        </button>
                                    </div>
                                }
                                
                                <div class="post-author">
                                    <div class="author-info">
                                        answered {{answer.createdAt | date:'MMM d, y'}}
                                        <a [routerLink]="['/users', answer.author.id]">
                                            {{answer.author.username}}
                                        </a>
                                        <div class="reputation">{{answer.author.reputation | number}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <!-- Answer Form -->
            <div class="answer-form">
                <h2>Your Answer</h2>
                <mat-form-field appearance="outline" class="full-width">
                    <textarea matInput
                             [(ngModel)]="newAnswer"
                             rows="10"
                             placeholder="Write your answer here..."></textarea>
                </mat-form-field>
                <button mat-flat-button color="primary" (click)="submitAnswer()">
                    Post Your Answer
                </button>
            </div>
        </div>
    `,
    styles: [`
        .thread-container {
            max-width: 1100px;
            margin: 24px auto;
            padding: 24px;
            background-color: white;
            border-radius: 8px;
            box-shadow: var(--so-box-shadow);
        }

        .question-header {
            padding-bottom: 16px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--so-border-color);

            h1 {
                font-family: var(--so-title-font);
                font-size: 27px;
                margin-bottom: 8px;
                color: var(--so-black);
            }

            .question-meta {
                display: flex;
                gap: 16px;
                color: var(--so-gray);
                font-size: 13px;

                span {
                    color: var(--so-gray-dark);
                }
            }
        }

        .post-layout {
            display: flex;
            gap: 16px;
            padding: 16px 0;
        }

        .vote-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 36px;
            color: var(--so-black);

            .vote-count {
                font-size: 21px;
                margin: 8px 0;
            }

            .mat-icon-button {
                width: 36px;
                height: 36px;
                line-height: 36px;

                mat-icon {
                    color: var(--so-black);
                }

                &:hover {
                    background-color: var(--so-gray-light);
                }
            }
        }

        .post-content {
            flex: 1;

            .post-body {
                font-size: 15px;
                line-height: 1.5;
                margin-bottom: 16px;
            }
        }

        .post-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 16px;

            .tag {
                background-color: #e1ecf4;
                color: var(--so-link-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                text-decoration: none;
                border: 1px solid #d1e5f1;

                &:hover {
                    background-color: #d0e3f1;
                    color: var(--so-link-hover);
                }
            }
        }

        .post-author {
            display: flex;
            justify-content: flex-end;
            padding-top: 16px;
            margin-top: 16px;
            border-top: 1px solid var(--so-border-color);

            .author-info {
                color: var(--so-gray);
                font-size: 12px;

                a {
                    color: var(--so-link-color);
                    text-decoration: none;
                    margin: 0 4px;

                    &:hover {
                        color: var(--so-link-hover);
                    }
                }

                .reputation {
                    display: inline;
                    color: var(--so-gray-dark);
                    font-weight: 500;
                }
            }
        }

        .answers-section {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--so-border-color);

            h2 {
                font-family: var(--so-title-font);
                font-size: 19px;
                margin-bottom: 16px;
                color: var(--so-black);
            }
        }

        .answer-item {
            border-bottom: 1px solid var(--so-border-color);
            background-color: #f8f9f9;
            border-radius: 10px;
            border: 3px solid var(--so-gray-light);
            margin-bottom: 16px;
            padding: 16px;

        }

        .answer-form {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--so-border-color);

            h2 {
                font-family: var(--so-title-font);
                font-size: 19px;
                margin-bottom: 16px;
                color: var(--so-black);
            }

            .full-width {
                width: 100%;
                margin-bottom: 16px;
            }

            textarea {
                font-family: inherit;
                font-size: 15px;
                line-height: 1.5;
                color: var(--so-black);
            }

            button {
                background-color: var(--so-link-hover);
                color: white;
                padding: 10px 16px;
                font-weight: 500;

                &:hover {
                    background-color: var(--so-link-color);
                }
            }
        }

        .content-with-edit {
            position: relative;
            padding-right: 80px; // Space for edit button
            min-height: 40px;
        }

        .edit-button {
            position: absolute;
            right: 0;
            top: 0;
            color: var(--so-link-color);
            border-color: var(--so-link-color);
            font-size: 13px;
            height: 32px;
            padding: 0 12px;

            mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
                margin-right: 4px;
            }

            &:hover {
                background-color: rgba(0,149,255,0.1);
            }
        }

        .edit-actions {
            display: flex;
            gap: 8px;
            margin: 8px 0;
            justify-content: flex-end;

            button {
                font-size: 13px;
                height: 35px;

                &:first-child {
                    color: var(--so-link-hover);
                    border-color: var(--so-link-hover);

                    &:hover {
                        background-color: rgba(0,149,255,0.1);
                    }
                }

                &:last-child {
                    color: var(--so-gray);
                    border-color: var(--so-border-color);

                    &:hover {
                        background-color: var(--so-gray-light);
                        color: var(--so-black);
                    }
                }
            }
        }

        .full-width {
            width: 100%;

            ::ng-deep {
                textarea {
                    font-family: inherit;
                    font-size: 15px;
                    line-height: 1.5;
                    color: var(--so-black) !important;
                    background-color: white;
                }

                .mat-mdc-form-field-flex {
                    background-color: white;
                }

                .mat-mdc-text-field-wrapper {
                    background-color: white;
                }

                .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
                    color: var(--so-black) !important;
                }

                .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
                    color: var(--so-black) !important;
                }
            }
        }
    `]
})
export class QuestionThreadComponent implements OnInit {
    question: Question | undefined;
    answers: any[] = [];
    newAnswer: string = '';
    
    // Edit mode states
    isEditingQuestion: boolean = false;
    editingAnswerId: number | null = null;
    editQuestionBody: string = '';
    editAnswerBody: string = '';

    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService
    ) {}

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.questionService.getQuestionById(id).subscribe(question => {
            this.question = question;
            // TODO: Load answers from a service
            this.answers = [
                {
                    id: 1,
                    body: 'This is a sample answer...',
                    votes: 5,
                    createdAt: new Date(),
                    author: {
                        id: 2,
                        username: 'sample_user',
                        reputation: 1234
                    }
                }
            ];
        });
    }

    // Question edit methods
    startQuestionEdit() {
        this.isEditingQuestion = true;
        this.editQuestionBody = this.question?.body || '';
    }

    saveQuestionEdit() {
        if (this.question && this.editQuestionBody.trim()) {
            this.question.body = this.editQuestionBody;
            // TODO: Implement actual save to backend
            this.isEditingQuestion = false;
        }
    }

    cancelQuestionEdit() {
        this.isEditingQuestion = false;
        this.editQuestionBody = '';
    }

    // Answer edit methods
    startAnswerEdit(answer: any) {
        this.editingAnswerId = answer.id;
        this.editAnswerBody = answer.body;
    }

    saveAnswerEdit(answerId: number) {
        const answer = this.answers.find(a => a.id === answerId);
        if (answer && this.editAnswerBody.trim()) {
            answer.body = this.editAnswerBody;
            // TODO: Implement actual save to backend
            this.editingAnswerId = null;
        }
    }

    cancelAnswerEdit() {
        this.editingAnswerId = null;
        this.editAnswerBody = '';
    }

    submitAnswer() {
        if (this.newAnswer.trim()) {
            // TODO: Implement answer submission
            console.log('Submitting answer:', this.newAnswer);
            this.newAnswer = '';
        }
    }
}
