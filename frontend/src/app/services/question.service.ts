import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../models/question.interface';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private mockQuestions: Question[] = [
        {
            id: 1,
            title: 'How to center a div in CSS?',
            body: 'I am trying to center a div horizontally and vertically in CSS. What is the best way to do this?',
            votes: 1542,
            answers: 23,
            views: 15234,
            tags: ['css', 'html', 'flexbox', 'centering'],
            author: {
                id: 1,
                username: 'john_doe',
                reputation: 1234
            },
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-15')
        },
        {
            id: 2,
            title: 'Understanding async/await in TypeScript',
            body: 'Can someone explain how async/await works in TypeScript? I am having trouble understanding the concept.',
            votes: 892,
            answers: 15,
            views: 8765,
            tags: ['typescript', 'javascript', 'async-await', 'promises'],
            author: {
                id: 2,
                username: 'jane_smith',
                reputation: 5678
            },
            createdAt: new Date('2024-03-14'),
            updatedAt: new Date('2024-03-14')
        },
        {
            id: 3,
            title: 'Angular: How to share data between components?',
            body: 'What are the different ways to share data between components in Angular? Which method is best for what scenario?',
            votes: 456,
            answers: 8,
            views: 4321,
            tags: ['angular', 'typescript', 'components', 'data-sharing'],
            author: {
                id: 3,
                username: 'angular_dev',
                reputation: 3456
            },
            createdAt: new Date('2024-03-13'),
            updatedAt: new Date('2024-03-13')
        },
        {
            id: 4,
            title: 'Best practices for REST API design',
            body: 'What are the current best practices for designing RESTful APIs? Looking for naming conventions, status codes, etc.',
            votes: 789,
            answers: 12,
            views: 6789,
            tags: ['api', 'rest', 'web-development', 'best-practices'],
            author: {
                id: 4,
                username: 'api_master',
                reputation: 8901
            },
            createdAt: new Date('2024-03-12'),
            updatedAt: new Date('2024-03-12')
        },
        {
            id: 5,
            title: 'Docker vs Kubernetes: When to use what?',
            body: 'I am confused about when to use Docker alone and when to use Kubernetes. Can someone explain the use cases?',
            votes: 234,
            answers: 6,
            views: 3456,
            tags: ['docker', 'kubernetes', 'containerization', 'devops'],
            author: {
                id: 5,
                username: 'devops_pro',
                reputation: 6789
            },
            createdAt: new Date('2024-03-11'),
            updatedAt: new Date('2024-03-11')
        }
    ];

    getQuestions(): Observable<Question[]> {
        return of(this.mockQuestions);
    }

    getQuestionById(id: number): Observable<Question | undefined> {
        return of(this.mockQuestions.find(q => q.id === id));
    }
} 