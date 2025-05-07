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
    templateUrl: './ask-question.component.html',
    styleUrls: ['./ask-question.component.scss']
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