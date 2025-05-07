import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

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
    user = {
        id: 1,
        username: 'john_doe',
        reputation: 12345,
        questionsCount: 42,
        answersCount: 156,
        isBanned: false,
        isAdmin: false,
        questions: [
            {
                id: 1,
                title: 'How to center a div in CSS?',
                votes: 15,
                createdAt: new Date('2024-03-15')
            },
            {
                id: 2,
                title: 'Understanding async/await in TypeScript',
                votes: 8,
                createdAt: new Date('2024-03-10')
            }
        ],
        answers: [
            {
                id: 1,
                questionId: 3,
                questionTitle: 'Best practices for REST API design',
                votes: 23,
                createdAt: new Date('2024-03-12')
            },
            {
                id: 2,
                questionId: 4,
                questionTitle: 'Angular: How to share data between components?',
                votes: 12,
                createdAt: new Date('2024-03-08')
            }
        ]
    };

    isAdmin = true;
    currentUserId = 2;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        const userId = Number(this.route.snapshot.paramMap.get('id'));
        // TODO: Load user data from a service
    }

    toggleBanStatus() {
        this.user.isBanned = !this.user.isBanned;
        // TODO: Implement actual ban/unban logic with backend
        console.log(`User ${this.user.isBanned ? 'banned' : 'unbanned'}`);
    }
} 