import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReplyService {
    private apiUrl = `${environment.apiUrl}/api/replies`;

    constructor(private http: HttpClient) {}

    private mapReply(reply: any): any {
        return {
            ...reply,
            voteCount: reply.voteCount || 0,
            likedBy: new Set(reply.likedBy || []),
            dislikedBy: new Set(reply.dislikedBy || [])
        };
    }

    getRepliesByQuestionId(questionId: string, page: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/get/by-question/${page}?questionId=${questionId}`)
            .pipe(map(replies => replies.map(reply => this.mapReply(reply))));
    }

    getRepliesByUser(userId: string, page: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/get/by-user/${page}?userId=${userId}`)
            .pipe(map(response => ({
                ...response,
                replies: response.replies.map((reply: any) => this.mapReply(reply))
            })));
    }

    createReply(reply: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, reply)
            .pipe(map(reply => this.mapReply(reply)));
    }

    updateReply(reply: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update`, reply)
            .pipe(map(reply => this.mapReply(reply)));
    }

    deleteReply(id: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.delete<any>(`${this.apiUrl}/delete?id=${id}`, { headers });
    }

    upvoteReply(replyId: string, userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/upvote?replyId=${replyId}&userId=${userId}`, {}, { responseType: 'text' });
    }

    downvoteReply(replyId: string, userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/downvote?replyId=${replyId}&userId=${userId}`, {}, { responseType: 'text' });
    }

    // Admin methods
    adminDeleteReply(id: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.delete<any>(`${this.apiUrl}/admin/delete?id=${id}`, { headers });
    }

    adminUpdateReply(reply: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.put<any>(`${this.apiUrl}/admin/update`, reply, { headers });
    }
} 