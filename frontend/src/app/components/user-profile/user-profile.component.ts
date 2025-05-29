import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { QuestionService } from '../../services/question.service';
import { ReplyService } from '../../services/reply.service';

interface Question {
    id: string;
    title: string;
    voteCount: number;
    createdAt: Date;
}

interface Reply {
    id: string;
    body: string;
    questionId: string;
    questionTitle: string;
    voteCount: number;
    createdAt: Date;
    author: {
        id: string;
    };
}

interface PaginatedResponse<T> {
    totalQuestions?: number;
    totalReplies?: number;
    questions?: T[];
    replies?: T[];
}

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule
    ],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    user: any = {
        id: '',
        email: '',
        name: '',
        score: 0,
        isAdmin: false,
        isBanned: false
    };

    questions: Question[] = [];
    answers: Reply[] = [];
    totalQuestions: number = 0;
    totalAnswers: number = 0;
    isAdmin = false;
    currentUserId: string | null = null;
    isLoading = true;
    isLoadingQuestions = false;
    isLoadingAnswers = false;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthService,
        private questionService: QuestionService,
        private replyService: ReplyService
    ) {}

    ngOnInit() {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.loadUserData(userId);
            this.loadUserQuestions(userId);
            this.loadUserAnswers(userId);
        }
        this.currentUserId = this.authService.getCurrentUser()?.id || null;
        this.isAdmin = this.authService.getCurrentUser()?.admin || false;
    }

    loadUserData(userId: string) {
        this.isLoading = true;
        this.userService.getUserById(userId).subscribe({
            next: (userData) => {
                this.user = userData;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading user data:', error);
                this.isLoading = false;
            }
        });
    }

    loadUserQuestions(userId: string) {
        this.isLoadingQuestions = true;
        this.questionService.getQuestionsByAuthor(userId, 0).subscribe({
            next: (response: PaginatedResponse<Question>) => {
                this.questions = response.questions || [];
                this.totalQuestions = response.totalQuestions || 0;
                this.isLoadingQuestions = false;
            },
            error: (error) => {
                console.error('Error loading user questions:', error);
                this.isLoadingQuestions = false;
            }
        });
    }

    loadUserAnswers(userId: string) {
        this.isLoadingAnswers = true;
        this.replyService.getRepliesByUser(userId, 0).subscribe({
            next: (response: PaginatedResponse<Reply>) => {
                this.answers = response.replies || [];
                this.totalAnswers = response.totalReplies || 0;
                this.isLoadingAnswers = false;
            },
            error: (error) => {
                console.error('Error loading user answers:', error);
                this.isLoadingAnswers = false;
            }
        });
    }

    toggleBanStatus() {
        if (this.user.isBanned) {
            this.userService.unbanUser(this.user.id).subscribe({
                next: (response) => {
                    this.user.isBanned = false;
                },
                error: (error) => {
                    console.error('Error unbanning user:', error);
                }
            });
        } else {
            this.userService.banUser(this.user.id).subscribe({
                next: (response) => {
                    this.user.isBanned = true;
                },
                error: (error) => {
                    console.error('Error banning user:', error);
                }
            });
        }
    }
} 