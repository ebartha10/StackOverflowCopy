import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppTopbar } from './layout/component/app.topbar';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AppTopbar],
    template: `
        <div class="app-container min-h-screen flex flex-col">
            <app-topbar></app-topbar>
            <main class="flex-1">
                <router-outlet></router-outlet>
            </main>
        </div>
    `
})
export class AppComponent {}
