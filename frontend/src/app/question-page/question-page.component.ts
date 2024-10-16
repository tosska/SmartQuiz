import { Component, inject } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionItemComponent } from './question-item/question-item.component';
import { CommonModule, NgIf } from '@angular/common';
import { QuestionItem } from '../_services/rest-backend/question-item.type';
import { QuizItem } from '../_services/rest-backend/quiz-item.type';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-question-page',
  standalone: true,
  imports: [QuestionItemComponent, NgIf, CommonModule, ReactiveFormsModule, MarkdownComponent],
  templateUrl: './question-page.component.html',
  styleUrl: './question-page.component.scss'
})
export class QuestionPageComponent {
  constructor(private route:ActivatedRoute){}
  id: number = 0 as number;

  createQuestionSubmitted = false;
  questions: QuestionItem[] = [];
  quiz: QuizItem = {} as QuizItem;

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);

  newQuestionForm = new FormGroup({
    type: new FormControl('multiple', [Validators.required]),  // Tipo di domanda: 'multiple' o 'open'
    questionText: new FormControl('', [Validators.required, Validators.maxLength(400)]),  // Testo della domanda
    options: new FormArray([                                    // Opzioni (solo per domande a risposta multipla)
      new FormControl(''),
      new FormControl(''),
      new FormControl(''),
      new FormControl('')
    ]),
    correctAnswer: new FormControl('', [Validators.required])   // Risposta corretta
  });
  

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id?.startsWith('$')) {
      id = id.substring(1);
    }
    if (!isNaN(Number(id))) {
      this.id = Number(id); 
      console.log(this.id);
      this.loadQuiz();
      this.loadQuestions();
    } else {
      console.error('Invalid id:', id);
    }
  }

  handleQuestionSubmit() {
    this.createQuestionSubmitted = true;
    
    if (this.newQuestionForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      const questionData: QuestionItem = {
        type: this.newQuestionForm.value.type as 'multiple' | 'open',
        questionText: this.newQuestionForm.value.questionText as string,
        correctAnswer: this.newQuestionForm.value.correctAnswer as string,
        QuizId: this.id,
      };
  
      // Aggiungi opzioni solo se il tipo di domanda è 'multiple'
      if (questionData.type === 'multiple') {
        if (this.newQuestionForm.value.options) {
          questionData.options = this.newQuestionForm.value.options?.filter(
            (option: string | null | undefined): option is string => option != null && option !== ''
          );
          
        }
      }
  
      // Invia la richiesta per creare la domanda
      this.restService.createQuestion(questionData).subscribe({
        next: (response: any) => {
          this.toastr.success(`Question added successfully!`, "Success!");
          this.createQuestionSubmitted = false;
          // Reset dei campi del form
          this.newQuestionForm.reset({
            type: 'multiple', 
            questionText: '',
            options: [
              '', // Opzione 1
              '', // Opzione 2
              '', // Opzione 3
              '', // Opzione 4
            ],
            correctAnswer: '',
          });
        },
        error: (err: any) => {
          this.toastr.error("Could not add the question.", "Oops! Something went wrong.");
        },
        complete: () => {
          this.loadQuestions(); // Funzione per aggiornare la lista delle domande
        }
      });
    }
  }
  

  loadQuiz() {
    this.restService.getQuizById(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.quiz = data;

      },
      error: (err) => {
        if (err.status === 401) {
          this.toastr.error("Il tuo token di accesso sembra essere scaduto. Accedi di nuovo", "Token scaduto");
          this.router.navigateByUrl("/login");
        } else {
          this.toastr.error(err.message, err.statusText);
        }
      }
    });
  }


  loadQuestions(){
    this.restService.getQuestions(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.questions = data as QuestionItem[];
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
  

  onDeleteQuestion(questionId: number) {
    this.questions = this.questions.filter(question => question.id !== questionId);
  }



}
