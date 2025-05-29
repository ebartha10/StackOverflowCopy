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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { QuestionService, QuestionDTO } from '../../services/question.service';

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
        MatAutocompleteModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './ask-question.component.html',
    styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent {
    questionTitle: string = '';
    questionBody: string = '';
    selectedTags: string[] = [];
    tagSearch: string = '';
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    isSubmitting: boolean = false;
    
    allTags: string[] = [
        'javascript', 'angular', 'typescript', 'css', 'html', 
         'node.js', 'python', 'java', 'c#',
        'php', 'android', 'jquery', 'sql', 'mysql',
        'ios', 'reactjs', 'arrays', 'django', 'spring'
    ];
    filteredTags: string[] = [];

    constructor(
        private questionService: QuestionService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

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
        if (value) {
            // If the tag doesn't exist in allTags, add it
            if (!this.allTags.includes(value)) {
                this.allTags.push(value);
            }
            
            // Add to selected tags if not already selected and under limit
            if (this.selectedTags.length < 5 && !this.selectedTags.includes(value)) {
                this.selectedTags.push(value);
            }
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
               this.selectedTags.length > 0 &&
               !this.isSubmitting;
    }

    onSubmit() {
        if (!this.isFormValid()) {
            return;
        }

        this.isSubmitting = true;

        const questionData: QuestionDTO = {
            title: this.questionTitle,
            body: this.questionBody,
            tags: this.selectedTags
        };

        this.questionService.createQuestion(questionData).subscribe({
            next: (response) => {
                this.snackBar.open('Question posted successfully!', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this.router.navigate(['/questions', response.id]);
            },
            error: (error) => {
                this.isSubmitting = false;
                this.snackBar.open(
                    error.error?.message || 'Failed to post question. Please try again.',
                    'Close',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    }
                );
            }
        });
    }

    // Add new method to handle key press events
    onTagInputKeyPress(event: Event) {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Enter') {
            keyboardEvent.preventDefault();
            const value = this.tagSearch.trim();
            if (value) {
                // If the tag doesn't exist in allTags, add it
                if (!this.allTags.includes(value)) {
                    this.allTags.push(value);
                }
                
                // Add to selected tags if not already selected and under limit
                if (this.selectedTags.length < 5 && !this.selectedTags.includes(value)) {
                    this.selectedTags.push(value);
                }
                this.tagSearch = '';
                this.filteredTags = [];
            }
        }
    }
} 