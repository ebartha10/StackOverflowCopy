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
    private apiUrl = `${environment.apiUrl}/api/users`;

    constructor(private http: HttpClient) {}

    getUserById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getUserByEmail(email: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/by-email?email=${email}`);
    }

    updateUser(userData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update`, userData);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete?id=${id}`);
    }

    banUser(userId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/ban/${userId}`, {});
    }

    unbanUser(userId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/unban?userId=${userId}`, {});
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