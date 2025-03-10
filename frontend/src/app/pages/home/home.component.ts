import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsListComponent } from '../../components/questions-list/questions-list.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, QuestionsListComponent],
    template: `
        <div class="container mx-auto px-4 py-6">
            <app-questions-list></app-questions-list>
        </div>
    `
})
export class HomeComponent {}
