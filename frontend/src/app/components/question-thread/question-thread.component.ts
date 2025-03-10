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
                        <div class="post-body">{{question.body}}</div>
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
                                <div class="post-body">{{answer.body}}</div>
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
    `]
})
export class QuestionThreadComponent implements OnInit {
    question: Question | undefined;
    answers: any[] = []; // Replace with proper Answer interface
    newAnswer: string = '';

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

    submitAnswer() {
        if (this.newAnswer.trim()) {
            // TODO: Implement answer submission
            console.log('Submitting answer:', this.newAnswer);
            this.newAnswer = '';
        }
    }
}
