import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question } from '../models/question.interface';

export interface QuestionDTO {
    id?: string;
    title: string;
    body: string;
    tags: string[];
    authorId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = `${environment.apiUrl}/api/questions`;

    constructor(private http: HttpClient) {}

    private mapQuestion(question: any): Question {
        return {
            ...question,
            authorId: question.authorId,
            answers: question.answers || 0,
            views: question.views || 0,
            author: {
                id: question.author?.id || question.authorId,
                name: question.author?.name || 'User',
                score: question.author?.score || 0
            },
            updatedAt: question.updatedAt || question.createdAt,
            voteCount: question.voteCount || 0,
            likedById: new Set(question.likedById || []),
            dislikedById: new Set(question.dislikedById || [])
        };
    }

    getQuestions(pageNumber: number = 0): Observable<Question[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/questions/get/all/${pageNumber}`)
            .pipe(map(questions => questions.map(q => this.mapQuestion(q))));
    }

    getQuestionById(id: string): Observable<Question> {
        return this.http.get<any>(`${this.apiUrl}/get/${id}`)
            .pipe(map(question => this.mapQuestion(question)));
    }

    getQuestionsByTag(tag: string, pageNumber: number = 0): Observable<Question[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/questions/get/by-tag/${pageNumber}?tag=${tag}`)
            .pipe(map(questions => questions.map(q => this.mapQuestion(q))));
    }

    getQuestionsByAuthor(authorId: string, page: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/get/by-author/${page}?authorId=${authorId}`);
    }

    getQuestionsByTitle(title: string, pageNumber: number = 0): Observable<Question[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/questions/get/by-title/${pageNumber}?title=${title}`)
            .pipe(map(questions => questions.map(q => this.mapQuestion(q))));
    }

    createQuestion(question: QuestionDTO): Observable<QuestionDTO> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.post<QuestionDTO>(`${this.apiUrl}/create`, question, { headers });
    }

    updateQuestion(question: Question): Observable<Question> {
        const updateData = {
            id: question.id,
            authorId: question.authorId,
            body: question.body
        };
        return this.http.put<any>(`${this.apiUrl}/update`, updateData)
            .pipe(map(question => this.mapQuestion(question)));
    }

    deleteQuestion(id: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.delete<any>(`${this.apiUrl}/delete?id=${id}`, { headers });
    }

    upvoteQuestion(questionId: string, userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/upvote?questionId=${questionId}&userId=${userId}`, {}, { responseType: 'text' });
    }

    downvoteQuestion(questionId: string, userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/downvote?questionId=${questionId}&userId=${userId}`, {}, { responseType: 'text' });
    }

    // Admin methods
    adminDeleteQuestion(id: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.delete<any>(`${this.apiUrl}/delete?id=${id}`, { headers });
    }

    adminUpdateQuestion(question: Question): Observable<Question> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.put<any>(`${this.apiUrl}/update`, question, { headers })
            .pipe(map(question => this.mapQuestion(question)));
    }
} 