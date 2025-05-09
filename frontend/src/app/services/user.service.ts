import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { Question } from '../models/question.interface';
import { Answer } from '../models/answer.interface';
import { Tag } from '../models/tag.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {}

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }

    getUserQuestions(userId: string): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.apiUrl}/${userId}/questions`);
    }

    getUserAnswers(userId: string): Observable<Answer[]> {
        return this.http.get<Answer[]>(`${this.apiUrl}/${userId}/answers`);
    }

    getUserTags(userId: string): Observable<Tag[]> {
        return this.http.get<Tag[]>(`${this.apiUrl}/${userId}/tags`);
    }
} 