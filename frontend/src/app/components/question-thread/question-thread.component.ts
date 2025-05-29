import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionService } from '../../services/question.service';
import { ReplyService } from '../../services/reply.service';
import { Question } from '../../models/question.interface';
import { AuthService } from '../../services/auth.service';

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
    currentPage: number = 0;
    pageSize: number = 5; // Number of answers per page
    totalAnswers: number = 0;
    isLoading: boolean = false;
    
    // Edit mode states
    isEditingQuestion: boolean = false;
    editingAnswerId: string | null = null;
    editQuestionBody: string = '';
    editAnswerBody: string = '';

    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private replyService: ReplyService,
        public authService: AuthService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadQuestion(id);
            this.loadReplies(id);
        }
    }

    loadQuestion(id: string) {
        this.questionService.getQuestionById(id).subscribe(question => {
            console.log('Loaded question:', question);
            this.question = question;
        });
    }

    loadReplies(questionId: string) {
        this.isLoading = true;
        this.replyService.getRepliesByQuestionId(questionId, this.currentPage).subscribe({
            next: (response: any) => {
                console.log('Replies response:', response);
                if (response.replies) {
                    this.answers = response.replies;
                    this.totalAnswers = response.totalReplies || 0;
                } else {
                    this.answers = response;
                    this.totalAnswers = response.length || 0;
                }
                console.log('Total answers:', this.totalAnswers);
                console.log('Total pages:', this.totalPages);
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading replies:', error);
                this.isLoading = false;
            }
        });
    }

    onPageChange(newPage: number) {
        if (newPage >= 0 && newPage < this.totalPages) {
            this.currentPage = newPage;
            if (this.question) {
                this.loadReplies(this.question.id);
            }
        }
    }

    get totalPages(): number {
        return Math.ceil(this.totalAnswers / this.pageSize);
    }

    get pages(): number[] {
        const pages: number[] = [];
        for (let i = 0; i < this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Helper methods for template
    isQuestionLiked(): boolean {
        const userId = this.authService.getCurrentUser()?.id;
        return userId ? this.question?.likedById?.has(userId) || false : false;
    }

    isQuestionDisliked(): boolean {
        const userId = this.authService.getCurrentUser()?.id;
        return userId ? this.question?.dislikedById?.has(userId) || false : false;
    }

    isAnswerLiked(answer: any): boolean {
        const userId = this.authService.getCurrentUser()?.id;
        return userId ? answer.likedBy?.has(userId) || false : false;
    }

    isAnswerDisliked(answer: any): boolean {
        const userId = this.authService.getCurrentUser()?.id;
        return userId ? answer.dislikedBy?.has(userId) || false : false;
    }

    isAdmin(): boolean {
        const user = this.authService.getCurrentUser();
        return user?.admin || false;
    }

    isQuestionAuthor(): boolean {
        const currentUser = this.authService.getCurrentUser();
        return currentUser?.id === this.question?.authorId || this.isAdmin();
    }

    isAnswerAuthor(answer: any): boolean {
        const currentUser = this.authService.getCurrentUser();
        return currentUser?.id === answer.authorId || this.isAdmin();
    }

    // Question edit methods
    startQuestionEdit() {
        this.isEditingQuestion = true;
        this.editQuestionBody = this.question?.body || '';
    }

    saveQuestionEdit() {
        if (this.question && this.editQuestionBody.trim()) {
            this.question.body = this.editQuestionBody;
            if (this.isAdmin()) {
                this.questionService.adminUpdateQuestion(this.question).subscribe({
                    next: (updatedQuestion) => {
                        this.question = updatedQuestion;
                        this.isEditingQuestion = false;
                    },
                    error: (error) => {
                        console.error('Error updating question:', error);
                    }
                });
            } else {
                this.questionService.updateQuestion(this.question).subscribe({
                    next: (updatedQuestion) => {
                        this.question = updatedQuestion;
                        this.isEditingQuestion = false;
                    },
                    error: (error) => {
                        console.error('Error updating question:', error);
                    }
                });
            }
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

    saveAnswerEdit(answerId: string) {
        const answer = this.answers.find(a => a.id === answerId);
        if (answer && this.editAnswerBody.trim()) {
            answer.body = this.editAnswerBody;
            if (this.isAdmin()) {
                this.replyService.adminUpdateReply(answer).subscribe({
                    next: (updatedAnswer) => {
                        const index = this.answers.findIndex(a => a.id === answerId);
                        if (index !== -1) {
                            this.answers[index] = updatedAnswer;
                        }
                        this.editingAnswerId = null;
                    },
                    error: (error) => {
                        console.error('Error updating answer:', error);
                    }
                });
            } else {
                this.replyService.updateReply(answer).subscribe({
                    next: (updatedAnswer) => {
                        const index = this.answers.findIndex(a => a.id === answerId);
                        if (index !== -1) {
                            this.answers[index] = updatedAnswer;
                        }
                        this.editingAnswerId = null;
                    },
                    error: (error) => {
                        console.error('Error updating answer:', error);
                    }
                });
            }
        }
    }

    cancelAnswerEdit() {
        this.editingAnswerId = null;
        this.editAnswerBody = '';
    }

    submitAnswer() {
        if (this.newAnswer.trim() && this.question) {
            const reply = {
                body: this.newAnswer,
                questionId: this.question.id,
                author: {id: this.authService.getCurrentUser()?.id}
            };

            this.replyService.createReply(reply).subscribe({
                next: (newReply) => {
                    this.answers.push(newReply);
                    this.newAnswer = '';
                },
                error: (error) => {
                    console.error('Error submitting answer:', error);
                }
            });
        }
    }

    upvoteReply(replyId: string) {
        const userId = this.authService.getCurrentUser()?.id;
        if (userId) {
            this.replyService.upvoteReply(replyId, userId).subscribe({
                next: (response) => {
                    if (response === "Reply upvoted!") {
                        const reply = this.answers.find(a => a.id === replyId);
                        if (reply) {
                            if (reply.dislikedBy?.has(userId)) {
                                reply.voteCount += 2; // +1 for removing downvote, +1 for adding upvote
                            } else {
                                reply.voteCount += 1;
                            }
                            if (!reply.likedBy) reply.likedBy = new Set();
                            reply.likedBy.add(userId);
                            if (reply.dislikedBy?.has(userId)) {
                                reply.dislikedBy.delete(userId);
                            }
                            this.cdr.detectChanges();
                        }
                    } else if (response === "Reply already upvoted!") {
                        console.log("Reply already upvoted");
                    }
                },
                error: (error) => {
                    console.error('Error upvoting reply:', error);
                }
            });
        }
    }

    downvoteReply(replyId: string) {
        const userId = this.authService.getCurrentUser()?.id;
        if (userId) {
            this.replyService.downvoteReply(replyId, userId).subscribe({
                next: (response) => {
                    if (response === "Reply downvoted!") {
                        const reply = this.answers.find(a => a.id === replyId);
                        if (reply) {
                            if (reply.likedBy?.has(userId)) {
                                reply.voteCount -= 2; // -1 for removing upvote, -1 for adding downvote
                            } else {
                                reply.voteCount -= 1;
                            }
                            if (!reply.dislikedBy) reply.dislikedBy = new Set();
                            reply.dislikedBy.add(userId);
                            if (reply.likedBy?.has(userId)) {
                                reply.likedBy.delete(userId);
                            }
                            this.cdr.detectChanges();
                        }
                    } else if (response === "Reply already downvoted!") {
                        console.log("Reply already downvoted");
                    }
                },
                error: (error) => {
                    console.error('Error downvoting reply:', error);
                }
            });
        }
    }

    upvoteQuestion() {
        const userId = this.authService.getCurrentUser()?.id;
        if (userId && this.question) {
            this.questionService.upvoteQuestion(this.question.id, userId).subscribe({
                next: (response) => {
                    if (response === "Question upvoted!") {
                        if (this.question) {
                            if (this.question.dislikedById?.has(userId)) {
                                this.question.voteCount += 2; // +1 for removing downvote, +1 for adding upvote
                            } else {
                                this.question.voteCount += 1;
                            }
                            if (!this.question.likedById) this.question.likedById = new Set();
                            this.question.likedById.add(userId);
                            if (this.question.dislikedById?.has(userId)) {
                                this.question.dislikedById.delete(userId);
                            }
                            this.cdr.detectChanges();
                        }
                    } else if (response === "Question already upvoted!") {
                        console.log("Question already upvoted");
                    }
                },
                error: (error) => {
                    console.error('Error upvoting question:', error);
                }
            });
        }
    }

    downvoteQuestion() {
        const userId = this.authService.getCurrentUser()?.id;
        if (userId && this.question) {
            this.questionService.downvoteQuestion(this.question.id, userId).subscribe({
                next: (response) => {
                    if (response === "Question downvoted!") {
                        if (this.question) {
                            if (this.question.likedById?.has(userId)) {
                                this.question.voteCount -= 2; // -1 for removing upvote, -1 for adding downvote
                            } else {
                                this.question.voteCount -= 1;
                            }
                            if (!this.question.dislikedById) this.question.dislikedById = new Set();
                            this.question.dislikedById.add(userId);
                            if (this.question.likedById?.has(userId)) {
                                this.question.likedById.delete(userId);
                            }
                            this.cdr.detectChanges();
                        }
                    } else if (response === "Question already downvoted!") {
                        console.log("Question already downvoted");
                    }
                },
                error: (error) => {
                    console.error('Error downvoting question:', error);
                }
            });
        }
    }

    deleteQuestion() {
        if (this.question && confirm('Are you sure you want to delete this question?')) {
            console.log('Deleting question:', this.question.id);
            if (this.isAdmin()) {
                this.questionService.adminDeleteQuestion(this.question.id).subscribe({
                    next: (response) => {
                        console.log('Question deleted successfully:', response);
                        this.router.navigate(['/']).then(() => {
                            console.log('Navigation completed');
                        });
                    },
                    error: (error) => {
                        console.error('Error deleting question:', error);
                        // If we get a 200 status code, treat it as success
                        if (error.status === 200) {
                            this.router.navigate(['/']).then(() => {
                                console.log('Navigation completed');
                            });
                        }
                    }
                });
            } else {
                this.questionService.deleteQuestion(this.question.id).subscribe({
                    next: (response) => {
                        console.log('Question deleted successfully:', response);
                        this.router.navigate(['/']).then(() => {
                            console.log('Navigation completed');
                        });
                    },
                    error: (error) => {
                        console.error('Error deleting question:', error);
                        // If we get a 200 status code, treat it as success
                        if (error.status === 200) {
                            this.router.navigate(['/']).then(() => {
                                console.log('Navigation completed');
                            });
                        }
                    }
                });
            }
        }
    }

    deleteAnswer(answerId: string) {
        if (confirm('Are you sure you want to delete this answer?')) {
            if (this.isAdmin()) {
                this.replyService.adminDeleteReply(answerId).subscribe({
                    next: () => {
                        this.answers = this.answers.filter(a => a.id !== answerId);
                    },
                    error: (error) => {
                        console.error('Error deleting answer:', error);
                    }
                });
            } else {
                this.replyService.deleteReply(answerId).subscribe({
                    next: () => {
                        this.answers = this.answers.filter(a => a.id !== answerId);
                    },
                    error: (error) => {
                        console.error('Error deleting answer:', error);
                    }
                });
            }
        }
    }
}
