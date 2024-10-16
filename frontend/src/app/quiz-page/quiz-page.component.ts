import { Component, inject } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { QuizItemComponent } from './quiz-item/quiz-item.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizItem } from '../_services/rest-backend/quiz-item.type';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [QuizItemComponent, ReactiveFormsModule, MarkdownComponent, CommonModule],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {
  createQuizSubmitted = false;
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  quizzes: QuizItem[] = []; //array of TodoItem

  newQuizForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(400)]),
    maxErrors: new FormControl(0, [Validators.required, Validators.min(0)]) 
  })
  
  
  ngOnInit() {
    this.fetchQuizzes();  
  }

  fetchQuizzes(){
    this.restService.getMyQuizzes().subscribe({
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

  handleQuizSubmit() {
    this.createQuizSubmitted = true;
    if (this.newQuizForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.restService.createQuiz({
        title: this.newQuizForm.value.title as string,
        description: this.newQuizForm.value.description as string,
        maxErrors: this.newQuizForm.value.maxErrors as number // Aggiunto maxErrors qui
      }).subscribe({
        next: (quiz) => {
          this.toastr.success(`Quiz item: ${quiz.title}`, "Quiz saved correctly!");
          this.createQuizSubmitted = false;
          this.newQuizForm.setValue({title: "", description: "", maxErrors: 0}); // Reset anche di maxErrors
        },
        error: (err) => {
          this.toastr.error("Could not save the Quiz item.", "Oops! Something went wrong.");
        },
        complete: () => {
          this.fetchQuizzes();
          this.newQuizForm.reset({title: '', description: '', maxErrors: 0}); // Reset completo del form
        }
      })
    }
  }
  

  handleDelete(id: number | undefined){
    console.log("DELETE HERE");
    console.log(id);
    this.quizzes = this.quizzes.filter((x) => x.id !== id)
  }
}
