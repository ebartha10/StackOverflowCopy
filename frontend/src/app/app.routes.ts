import { Routes } from '@angular/router';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { QuestionThreadComponent } from './components/question-thread/question-thread.component';
import { AuthComponent } from './components/auth/auth.component';
import { AskQuestionComponent } from './components/ask-question/ask-question.component';

export const routes: Routes = [
    {
        path: '',
        component: QuestionsListComponent
    },
    {
        path: 'questions/ask',
        component: AskQuestionComponent
    },
    {
        path: 'questions/:id',
        component: QuestionThreadComponent
    },
    {
        path: 'users/:id',
        loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
    },
    {
        path: 'auth',
        component: AuthComponent
    }
];
