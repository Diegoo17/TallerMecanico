import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Interface/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private urlBase = 'http://localhost:3000/comments';

  getComments(start: number, limit: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.urlBase}?_start=${start}&_limit=${limit}`);
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.urlBase, comment);
  }
} 