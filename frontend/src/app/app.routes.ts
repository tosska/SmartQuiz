import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { authGuard } from './_guards/auth.guard';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { QuizPartecipationComponent } from './quiz-partecipation/quiz-partecipation.component';

export const routes: Routes = [
    {
        path: "home",
        component: HomepageComponent,
        title: "SmartQuiz Angular App"
    }, {
        path: "login",
        component: LoginComponent,
        title: "Login | SmartQuiz Angular App"
    }, {
        path: "signup",
        component: SignupComponent,
        title: "Sign up | SmartQuiz Angular App"
    }, {
        path: "logout",
        component: LogoutComponent,
        title: "Log out | SmartQuiz Angular App"
    }, {
        path: "my-quizzes",
        component: QuizPageComponent,
        title: "Quiz | SmartQuiz Angular App",
        canActivate: [authGuard]
    }, {
        path: "quiz-details/:id",
        component: QuizDetailsComponent,
        title: "Quiz Detail | SmartQuiz Angular App",
        canActivate: [authGuard]
    }, {
        path: "quiz-questions/:id",
        component: QuestionPageComponent,
        title: "Quiz Questions | SmartQuiz Angular App",
        canActivate: [authGuard]
    }, {
        path: "quiz-partecipation/:id",
        component: QuizPartecipationComponent,
        title: "Quiz Partecipetion | SmartQuiz Angular App"
    }, {
        path: "",
        redirectTo: "/home",
        pathMatch: 'full'
    },
];
