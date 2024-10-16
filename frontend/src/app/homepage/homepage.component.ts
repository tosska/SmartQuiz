import { Component, inject, Input } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { QuizItem } from '../_services/rest-backend/quiz-item.type';
import { QuizCardComponent } from "./quiz-card/quiz-card.component";


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, QuizCardComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  authService = inject(AuthService);

  quizzes: QuizItem[] = []; //array of TodoItem

  
  ngOnInit() {
    this.fetchQuizzes();  
  }

  fetchQuizzes(){
    this.restService.getAllQuizzes().subscribe({
      next: (data) => {
        console.log(data);
        this.quizzes = data;
      },
      error: (err) => {
        if(err.status === 401){
          this.toastr.error("Your access token appears to be invalid. Login again", "Token expired");
          this.router.navigateByUrl("/login");
        } else {
          this.toastr.error(err.message, err.statusText)
        }
      }
    });
  }

  

   

}
