import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthRequest } from './auth-request.type';
import { QuizItem } from './quiz-item.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionItem } from './question-item.type';

// Service for making HTTP requests to the backend REST API

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  url = "http://localhost:3000"
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest) {
    const url = `${this.url}/login`;
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: AuthRequest) {
    const url = `${this.url}/signup`;
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  deleteQuiz(quizItem: QuizItem) {
    const url = `${this.url}/my-quizzes/${quizItem.id}`; 
    return this.http.delete(url, this.httpOptions);
  }

  getMyQuizzes() {
    const url = `${this.url}/my-quizzes`;
    return this.http.get<QuizItem[]>(url, this.httpOptions);
  }

  getAllQuizzes() {
    const url = `${this.url}/all-quizzes`;
    return this.http.get<QuizItem[]>(url, this.httpOptions);
  }

  createQuiz(quiz: QuizItem){
    const url = `${this.url}/my-quizzes`;
    return this.http.post<QuizItem>(url, quiz, this.httpOptions);
  }

  getQuizById(id: number) {
    const url = `${this.url}/all-quizzes/${id}`;
    return this.http.get<QuizItem>(url, this.httpOptions);
  }

  getQuizQrCode(quizId: string): Observable<string> {
    const url = `${this.url}/all-quizzes/${quizId}/qrcode`;
    return this.http.get<{ qrCodeUrl: string }>(url).pipe(
      map(response => response.qrCodeUrl)
    );
  }

  getResponses(id: number) {
    const url = `${this.url}/my-quizzes/${id}/responses`; 
    return this.http.get(url, this.httpOptions);
  }

  getQuestions(id: number) {
    const url = `${this.url}/all-quizzes/${id}/questions`; 
    return this.http.get(url, this.httpOptions);
  }

  deleteQuestion(questionItem: QuestionItem) {
    const url = `${this.url}/my-quizzes/${questionItem.QuizId}/questions/${questionItem.id}`; 
    return this.http.delete(url, this.httpOptions);
  }

  createQuestion(questionItem: QuestionItem){
    const url = `${this.url}/my-quizzes/${questionItem.QuizId}/questions`;
    return this.http.post<QuizItem>(url, questionItem, this.httpOptions);
  }

  submitQuizAnswers(submission: any): Observable<any> {
    console.log('Richiesta ricevuta:', submission.body);  
    return this.http.post(`${this.url}/quiz-partecipation/${submission.quizId}/submit`, submission);
  }

  getResults(id: number) {
    const url = `${this.url}/my-quizzes/${id}/results`; 
    return this.http.get(url, this.httpOptions);
  }
  


  
  
  

  

  
  
  
}
