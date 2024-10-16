import { Component, inject } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizItem } from '../_services/rest-backend/quiz-item.type';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { NgIf, CommonModule } from '@angular/common';
// import { ResponseComponent } from './response/response.component';
import { ResponseItem } from '../_services/rest-backend/response-item.type';
import { ResultItem } from '../_services/rest-backend/result-item.type'; // Importa StatisticItem
import { QuestionItem } from '../_services/rest-backend/question-item.type';

@Component({
  selector: 'app-quiz-details',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule, MarkdownComponent],
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent {
  constructor(private route: ActivatedRoute) {}
  id: number = 0;

  quiz: QuizItem = {} as QuizItem;
  results: ResultItem[] = [];  // Cambiato per memorizzare i risultati
  responses: ResponseItem[] = []; // Risposte complessive
  questions: QuestionItem[] = [];
  qrCodeUrl: string | undefined;
  shareableLink: string | undefined;

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);

  

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
      this.loadResponses();
      this.loadResults(); 
    } else {
      console.error('Invalid id:', id);
    }
  }

  loadQuiz() {
    this.restService.getQuizById(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.quiz = data;

        if (this.quiz && this.quiz.id) {
          this.generateQrCode(this.quiz.id.toString());
        } else {
          console.error('Il quiz non ha un ID valido');
        }
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

  loadQuestions() {
    // Assumendo che tu abbia un endpoint per ottenere le domande
    this.restService.getQuestions(this.id).subscribe({
      next: (data) => {
        this.questions = data as QuestionItem[]; // Salva le domande in una proprietà locale
      },
      error: (err) => {
        this.toastr.error('Errore nel caricamento delle domande');
      }
    });
  }


  generateQrCode(id: string) {
    this.shareableLink = `http://localhost:4200/quiz-participation/${id}`; 

    this.restService.getQuizQrCode(id).subscribe(url => {
        this.qrCodeUrl = url;
        console.log('URL QR Code:', this.qrCodeUrl); 
    }, error => {
        console.error('Errore nella generazione del QR Code:', error);
    });
  }

  copyToClipboard() {
    if (this.shareableLink) {
      navigator.clipboard.writeText(this.shareableLink).then(() => {
        alert("Link copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    }
  }

  loadResults() {
    this.restService.getResults(this.id).subscribe({
        next: (data) => {
            this.results = data as ResultItem[];
            console.log('Results loaded:', this.results);
        },
        error: (err) => {
            this.toastr.error('Error loading results');
        }
    });
}

loadResponses() {
    this.restService.getResponses(this.id).subscribe({
        next: (data) => {
            this.responses = data as ResponseItem[];
            console.log('Responses loaded:', this.responses);
        },
        error: (err) => {
            this.toastr.error('Error loading responses');
        }
    });
}


getResponsesForResult(resultId: number | undefined): ResponseItem[] {
  if (resultId === undefined) {
    return []; // Restituisce un array vuoto se il resultId è undefined
  }
  console.log('Filtering responses for ResultId:', resultId);
  return this.responses.filter(response => response.ResultId === resultId);
}

getQuestionText(questionId: number): string {
  const question = this.questions.find(q => q.id === questionId);
  return question ? question.questionText : 'Domanda non trovata';
}




}
