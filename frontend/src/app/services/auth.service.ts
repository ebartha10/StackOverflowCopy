import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.interface';
import { isPlatformBrowser } from '@angular/common';

export interface AuthResponse {
  token: string;
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly USER_DATA_KEY = 'user_data';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const userId = localStorage.getItem(this.USER_ID_KEY);
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      
      if (token && userId) {
        this.isAuthenticatedSubject.next(true);
        if (userData && userData !== 'undefined') {
          try {
            const parsedUser = JSON.parse(userData);
            this.currentUserSubject.next(parsedUser);
          } catch (e) {
            console.error('Error parsing user data:', e);
            this.fetchCurrentUser();
          }
        } else {
          this.fetchCurrentUser();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, userData)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_ID_KEY, response.userId);
    }
    this.isAuthenticatedSubject.next(true);
    this.fetchCurrentUser();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private fetchCurrentUser(): void {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      this.currentUserSubject.next(null);
      return;
    }

    this.http.get<User>(`${environment.apiUrl}/api/users/${userId}`).subscribe({
      next: (user) => {
        if (user) {
          this.currentUserSubject.next(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
          }
        } else {
          console.error('No user data received from API');
          this.currentUserSubject.next(null);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.USER_DATA_KEY);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.currentUserSubject.next(null);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem(this.USER_DATA_KEY);
        }
      }
    });
  }
} 