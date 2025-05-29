import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
    currentPage: number = 0;
    isLoading: boolean = false;

    constructor(
        private questionService: QuestionService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['search']) {
                this.searchByTitle(params['search']);
            } else {
                this.loadQuestions();
            }
            if (params['page']) {
                this.currentPage = parseInt(params['page']) - 1;
            }
        });
    }

    loadQuestions() {
        this.isLoading = true;
        this.questionService.getQuestions(this.currentPage).subscribe({
            next: (questions) => {
                this.questions = questions;
                this.filteredQuestions = questions;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading questions:', error);
                this.isLoading = false;
            }
        });
    }

    loadNextPage() {
        this.currentPage++;
        this.loadQuestions();
    }

    loadPreviousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadQuestions();
        }
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
        
        if (this.selectedTags.length > 0) {
            // Load questions for the first selected tag
            this.questionService.getQuestionsByTag(this.selectedTags[0], this.currentPage)
                .subscribe(questions => {
                    this.filteredQuestions = questions;
                });
        } else {
            this.loadQuestions();
        }
    }

    searchByTitle(title: string) {
        if (title.trim()) {
            this.questionService.getQuestionsByTitle(title, this.currentPage)
                .subscribe(questions => {
                    this.filteredQuestions = questions;
                });
        } else {
            this.loadQuestions();
        }
    }
}
