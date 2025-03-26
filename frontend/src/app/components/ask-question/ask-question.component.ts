import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-ask-question',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule
    ],
    template: `
        <div class="ask-question-container">
            <div class="page-header">
                <h1>Ask a public question</h1>
            </div>

            <!-- Writing Tips -->
            <div class="writing-tips">
                <h2>Writing a good question</h2>
                <div class="tips-content">
                    <p>Steps to write a good question:</p>
                    <ul>
                        <li>Summarize your problem in a one-line title</li>
                        <li>Describe your problem in more detail</li>
                        <li>Describe what you tried and what you expected to happen</li>
                        <li>Add "tags" which help surface your question to members of the community</li>
                        <li>Review your question and post it to the site</li>
                    </ul>
                </div>
            </div>

            <!-- Question Form -->
            <form class="question-form" (ngSubmit)="onSubmit()">
                <!-- Title -->
                <div class="form-section">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Title</mat-label>
                        <input matInput 
                               [(ngModel)]="questionTitle" 
                               name="title"
                               placeholder="e.g. How to center a div in CSS?"
                               required>
                        <mat-hint>Be specific and imagine you're asking a question to another person.</mat-hint>
                    </mat-form-field>
                </div>

                <!-- Body -->
                <div class="form-section">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Body</mat-label>
                        <textarea matInput
                                  [(ngModel)]="questionBody"
                                  name="body"
                                  rows="15"
                                  placeholder="Include all the information someone would need to answer your question"
                                  required></textarea>
                        <mat-hint>Include all the details someone would need to answer your question.</mat-hint>
                    </mat-form-field>
                </div>

                <!-- Tags -->
                <div class="form-section">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Tags</mat-label>
                        <mat-chip-grid #chipGrid aria-label="Tag selection">
                            @for (tag of selectedTags; track tag) {
                                <mat-chip-row
                                    (removed)="removeTag(tag)">
                                    {{tag}}
                                    <button matChipRemove>
                                        <mat-icon>cancel</mat-icon>
                                    </button>
                                </mat-chip-row>
                            }
                        </mat-chip-grid>
                        <input placeholder="e.g. (angular typescript css)"
                               [matChipInputFor]="chipGrid"
                               [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                               [matChipInputAddOnBlur]="true"
                               [(ngModel)]="tagSearch"
                               (ngModelChange)="filterTags()"
                               name="tagInput">
                        <mat-hint>Add up to 5 tags to describe what your question is about.</mat-hint>
                    </mat-form-field>
                    
                    <!-- Filtered Tags List -->
                    @if (tagSearch && filteredTags.length > 0) {
                        <div class="filtered-tags">
                            @for (tag of filteredTags; track tag) {
                                <div class="tag-item" 
                                     [class.selected]="selectedTags.includes(tag)"
                                     (click)="toggleTag(tag)">
                                    <span class="tag-name">{{tag}}</span>
                                    <mat-icon *ngIf="selectedTags.includes(tag)" class="check-icon">check</mat-icon>
                                </div>
                            }
                        </div>
                    }
                </div>

                <!-- Submit Button -->
                <div class="form-actions">
                    <button mat-flat-button 
                            color="primary" 
                            type="submit" 
                            class="submit-button"
                            [disabled]="!isFormValid()">
                        Post your question
                    </button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .ask-question-container {
            max-width: 850px;
            margin: 0 auto;
            padding: 24px;
        }

        .page-header {
            margin-bottom: 24px;

            h1 {
                font-size: 27px;
                font-family: var(--so-title-font);
                color: var(--so-black);
                margin: 0;
            }
        }

        .writing-tips {
            background-color: #fdf7e2;
            border: 1px solid #e6cf79;
            border-radius: 4px;
            padding: 24px;
            margin-bottom: 24px;

            h2 {
                font-size: 15px;
                margin: 0 0 16px 0;
                color: var(--so-black);
            }

            .tips-content {
                font-size: 13px;
                color: var(--so-gray-dark);

                p {
                    margin: 0 0 8px 0;
                }

                ul {
                    margin: 0;
                    padding-left: 24px;

                    li {
                        margin-bottom: 8px;
                    }
                }
            }
        }

        .question-form {
            background-color: white;
            border: 1px solid var(--so-border-color);
            border-radius: 4px;
            padding: 24px;
            box-shadow: var(--so-box-shadow);

            .form-section {
                margin-bottom: 24px;
                position: relative;

                .full-width {
                    width: 100%;
                }
            }

            ::ng-deep {
                .mat-mdc-form-field {
                    .mat-mdc-form-field-flex {
                        background-color: white;
                    }

                    .mat-mdc-text-field-wrapper {
                        background-color: white;
                    }

                    input, textarea {
                        font-size: 13px;
                        color: var(--so-black) !important;
                    }

                    .mat-mdc-form-field-hint {
                        font-size: 12px;
                        color: var(--so-black) !important;
                    }

                    .mdc-floating-label, .mdc-floating-label--float-above {
                        color: var(--so-black) !important;
                    }

                    .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
                        color: var(--so-black) !important;
                    }

                    .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
                        color: var(--so-black) !important;
                    }
                }

                .mdc-text-field--outlined {
                    --mdc-theme-text-primary-on-background: var(--so-black);
                }

                .mat-mdc-chip-grid {
                    min-height: 37px;
                    padding: 8px;
                }

                .mat-mdc-chip {
                    font-size: 13px;
                    background-color: #e1ecf4;
                    color: var(--so-black) !important;

                    .mdc-evolution-chip__text-label {
                        color: var(--so-black) !important;
                    }

                    .mat-mdc-chip-remove {
                        color: var(--so-red) !important;
                        opacity: 1 !important;
                    }

                    .mat-icon {
                        color: var(--so-red) !important;
                        font-size: 18px;
                    }
                }
            }

            .filtered-tags {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid var(--so-border-color);
                border-radius: 4px;
                box-shadow: var(--so-box-shadow);
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;

                .tag-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 12px;
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

            .form-actions {
                display: flex;
                justify-content: flex-start;

                .submit-button {
                    background-color: var(--so-link-hover);
                    color: white;
                    height: 38px;
                    padding: 0 16px;
                    font-weight: 500;

                    &:hover:not(:disabled) {
                        background-color: var(--so-link-color);
                    }

                    &:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                }
            }
        }
    `]
})
export class AskQuestionComponent {
    questionTitle: string = '';
    questionBody: string = '';
    selectedTags: string[] = [];
    tagSearch: string = '';
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    
    allTags: string[] = [
        'javascript', 'angular', 'typescript', 'css', 'html', 
        'react', 'node.js', 'python', 'java', 'c#',
        'php', 'android', 'jquery', 'sql', 'mysql',
        'ios', 'reactjs', 'arrays', 'django', 'spring'
    ];
    filteredTags: string[] = [];

    filterTags() {
        if (!this.tagSearch.trim()) {
            this.filteredTags = [];
        } else {
            const search = this.tagSearch.toLowerCase();
            this.filteredTags = this.allTags.filter(tag =>
                tag.toLowerCase().includes(search) &&
                !this.selectedTags.includes(tag)
            );
        }
    }

    toggleTag(tag: string) {
        const index = this.selectedTags.indexOf(tag);
        if (index === -1 && this.selectedTags.length < 5) {
            this.selectedTags.push(tag);
        } else if (index >= 0) {
            this.selectedTags.splice(index, 1);
        }
        this.tagSearch = '';
        this.filteredTags = [];
    }

    addTag(event: any) {
        const value = (event.value || '').trim();
        if (value && this.selectedTags.length < 5 && !this.selectedTags.includes(value)) {
            this.selectedTags.push(value);
        }
        event.chipInput!.clear();
        this.tagSearch = '';
        this.filteredTags = [];
    }

    removeTag(tag: string) {
        const index = this.selectedTags.indexOf(tag);
        if (index >= 0) {
            this.selectedTags.splice(index, 1);
        }
    }

    isFormValid(): boolean {
        return this.questionTitle.trim().length > 0 &&
               this.questionBody.trim().length > 0 &&
               this.selectedTags.length > 0;
    }

    onSubmit() {
        if (this.isFormValid()) {
            console.log('Submitting question:', {
                title: this.questionTitle,
                body: this.questionBody,
                tags: this.selectedTags
            });
            // TODO: Implement actual submission logic
        }
    }
} 