import { Component, inject, Input } from '@angular/core';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizItem } from '../../_services/rest-backend/quiz-item.type';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [MarkdownComponent, CommonModule, RouterLink],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss'
})
export class QuizCardComponent {
  @Input({ required: true}) quizItem: QuizItem; //set "strictPropertyInitialization": false in tsconfig
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);


  ngOnInit(){
  }
}
