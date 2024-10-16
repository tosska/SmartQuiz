import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { QuestionItem } from '../../_services/rest-backend/question-item.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-question-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss'
})
export class QuestionItemComponent {
  @Input({ required: true}) questionItem: QuestionItem; //set "strictPropertyInitialization": false in tsconfig
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
    if(this.questionItem !== null){
      this.restBackend.deleteQuestion(this.questionItem)
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (err) => {
            this.toastr.error("Error when deleting the quiz");
          },
          complete: () => {
            this.toastr.success(`Quiz item "${this.questionItem?.questionText}" deleted`, `Question deleted`);
            this.delete.emit(this.questionItem?.id);
          }
        })
    }
  }

}
