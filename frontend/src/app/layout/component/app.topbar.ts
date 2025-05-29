import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.interface';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        FormsModule
    ],
    templateUrl: './app.topbar.html',
    styleUrls: ['./app.topbar.scss'],
})
export class AppTopbar implements OnInit, OnDestroy {
    isLoggedIn = false;
    currentUser: User | null = null;
    searchQuery: string = '';
    private subscriptions: Subscription[] = [];

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        // Initial state
        this.isLoggedIn = this.authService.isAuthenticated();
        this.currentUser = this.authService.getCurrentUser();

        // Subscribe to authentication state changes
        this.subscriptions.push(
            this.authService.isAuthenticated$.subscribe(isAuthenticated => {
                this.isLoggedIn = isAuthenticated;
                if (!isAuthenticated) {
                    this.currentUser = null;
                }
            })
        );

        // Subscribe to user data changes
        this.subscriptions.push(
            this.authService.currentUser$.subscribe(user => {
                if (user) {
                    this.currentUser = user;
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }

    onSearch(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.searchQuery.trim()) {
            this.router.navigate(['/'], {
                queryParams: { 
                    search: this.searchQuery.trim(),
                    page: 1
                }
            });
        }
    }
}
