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
    templateUrl: './questions-list.component.html',
    styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {
    questions: Question[] = [];
    tagSearch: string = '';
    allTags: string[] = ['javascript', 'angular', 'typescript', 'css', 'html', 'react', 'node.js', 'python', 'java', 'c#'];
    filteredTags: string[] = this.allTags;
    selectedTags: string[] = [];
    filteredQuestions: Question[] = [];

    constructor(private questionService: QuestionService) {}

    ngOnInit() {
        this.questionService.getQuestions().subscribe(questions => {
            this.questions = questions;
            this.filteredQuestions = questions;
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
        this.filteredQuestions = this.questions.filter(question =>
            question.tags.some(tag => this.selectedTags.includes(tag))
        );
        if (this.selectedTags.length === 0) {
            this.filteredQuestions = this.questions;
        }

    }
}
