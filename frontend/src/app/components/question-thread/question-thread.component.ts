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
    templateUrl: './question-thread.component.html',
    styleUrls: ['./question-thread.component.scss']
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
