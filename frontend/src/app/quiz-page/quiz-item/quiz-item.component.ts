import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { QuizItem } from '../../_services/rest-backend/quiz-item.type';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-item',
  standalone: true,
  imports: [RouterLink, MarkdownComponent, CommonModule],
  templateUrl: './quiz-item.component.html',
  styleUrl: './quiz-item.component.scss'
})
export class QuizItemComponent {
  @Input({ required: true}) quizItem: QuizItem; //set "strictPropertyInitialization": false in tsconfig
  @Output() delete: EventEmitter<number> = new EventEmitter();
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);


  ngOnInit(){
  }

  confirmDelete() {
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    if (isConfirmed) {
      this.handleDelete();
    }
  }

  handleDelete(){
    if(this.quizItem !== null){
      this.restBackend.deleteQuiz(this.quizItem)
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (err) => {
            this.toastr.error("Error when deleting the quiz");
          },
          complete: () => {
            this.toastr.success(`Quiz item "${this.quizItem?.title}" deleted`, `Quiz deleted`);
            this.delete.emit(this.quizItem?.id);
          }
        })
    }
  }

  
}
