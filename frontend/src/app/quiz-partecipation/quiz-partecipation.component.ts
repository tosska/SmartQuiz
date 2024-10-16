import { Component, inject } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { QuestionItemComponent } from "../question-page/question-item/question-item.component";
import { QuestionItem } from '../_services/rest-backend/question-item.type';

@Component({
  selector: 'app-quiz-partecipation',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule, MarkdownComponent, QuestionItemComponent],
  templateUrl: './quiz-partecipation.component.html',
  styleUrl: './quiz-partecipation.component.scss'
})
export class QuizPartecipationComponent {
  quiz: any = {};
  userName: string = ''; // Nome dell'utente (opzionale)
  userAnswers: any[] = []; // Risposte dell'utente

  qrCodeUrl: string | undefined;
  shareableLink: string | undefined;

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  
  questions: QuestionItem[] = [];
  showError: boolean = false; // Variabile per mostrare il messaggio di errore
  
  constructor(private route: ActivatedRoute) {}
  
  id: number = 0 as number;

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

  // Gestione della selezione delle opzioni per le domande a risposta multipla
  handleCheckboxChange(questionId: number, option: string, isChecked: boolean): void {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
        if (!this.userAnswers[questionIndex]) {
            this.userAnswers[questionIndex] = []; // Inizializza come array vuoto se non esiste
        }
        if (isChecked) {
            // Aggiungi l'opzione selezionata (il testo dell'opzione)
            this.userAnswers[questionIndex].push(option);
        } else {
            // Rimuovi l'opzione non selezionata
            const optionIndex = this.userAnswers[questionIndex].indexOf(option);
            if (optionIndex > -1) {
                this.userAnswers[questionIndex].splice(optionIndex, 1);
            }
        }
    }
  }
  

  // Durante l'invio, assicurati di convertire gli array in stringhe
  submitQuiz(): void {
    console.log('Nome utente:', this.userName); // Aggiungi questo log per il debug
    const finalUserName = this.userName.trim() || 'Anonymous';
    
    const submission = {
      name: finalUserName,
      quizId: this.quiz.id,
      answers: this.questions.map((question, index) => {
        const answer = this.userAnswers[index];
  
        // Controlla il tipo di domanda e gestisci le risposte di conseguenza
        return {
          questionId: question.id,
          answer: question.type === 'multiple' ? answer : answer || '', // Se è multipla, usa l'array, altrimenti usa la stringa
        };
      }),
    };
  
    console.log('Dati inviati al backend:', JSON.stringify(submission, null, 2));
  
    this.restService.submitQuizAnswers(submission).subscribe({
      next: () => {
        this.toastr.success('Risposte inviate con successo!');
      },
      error: (err: any) => {
        this.toastr.error('Errore durante l\'invio delle risposte');
      },
    });
  }
  
  

  loadQuiz() {
    this.restService.getQuizById(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.quiz = data;

        // Controlla se quiz e id sono definiti
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

  generateQrCode(id: string) {
    this.shareableLink = `http://localhost:4200/quiz-partecipation/${id}`; 

    this.restService.getQuizQrCode(id).subscribe(url => {
        this.qrCodeUrl = url;
        console.log('URL QR Code:', this.qrCodeUrl); // Logga l'URL del QR code per verificare
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

  loadQuestions() {
    this.restService.getQuestions(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.questions = data as QuestionItem[];
  
        // Inizializza l'array delle risposte
        this.questions.forEach((question, index) => {
          if (question.type === 'multiple') {
            // Se la domanda è a risposta multipla, inizializza con una stringa vuota (risposta selezionata)
            this.userAnswers[index] = ''; // Usare stringa vuota per radio button
          } else {
            // Per domande aperte, inizializza con una stringa vuota
            this.userAnswers[index] = '';
          }
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastr.error("Your access token appears to be invalid. Login again", "Token expired");
          this.router.navigateByUrl("/login");
        } else {
          this.toastr.error(err.message, err.statusText);
        }
      }
    });
  }

  trySubmitQuiz() {
    if (!this.allQuestionsAnswered()) {
      this.showError = true; // Mostra il messaggio di errore
    } else {
      this.showError = false; // Nascondi il messaggio di errore
      this.submitQuiz(); // Invia il quiz
    }
  }
  
  allQuestionsAnswered(): boolean {
    return this.questions.every((question, index) => {
      return this.userAnswers[index] !== undefined && this.userAnswers[index] !== '';
    });
  }
  

  
  
  
}
