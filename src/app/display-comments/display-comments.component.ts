import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { Comment } from '../Interface/comment';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-display-comments',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [CommentService],
  templateUrl: './display-comments.component.html',
  styleUrls: ['./display-comments.component.css']
})
export class DisplayCommentsComponent implements OnInit {
  comments: Comment[] = [];
  currentPage = 0;
  limit = 5;
  hasMore = true;

  constructor(
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarComentarios();
  }

  cargarComentarios() {
    const start = this.currentPage * this.limit;
    this.commentService.getComments(start, this.limit).subscribe({
      next: (newComments) => {
        this.comments = [...this.comments, ...newComments];
        this.hasMore = newComments.length === this.limit;
      },
      error: (error) => console.error('Error cargando comentarios:', error)
    });
  }

  cargarMas() {
    this.currentPage++;
    this.cargarComentarios();
  }

  navegarACrear() {
    this.router.navigate(['/create-comments']);
  }
  
}
