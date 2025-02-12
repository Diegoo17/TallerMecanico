import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommentService } from '../../Service/comment.service';
import { Comment } from '../../Interface/comment';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  private commentService = inject(CommentService);
  private router = inject(Router);

  allComments: Comment[] = [];
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  currentPage = 0;
  limit = 5;
  hasMore = true;
  mostrarSoloMisComentarios = false;
  currentUserId: string | null = null;

  constructor() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserId = user.id;
    }
  }

  ngOnInit() {
    this.cargarComentarios();
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        this.allComments = comments;
      },
      error: (error) => console.error('Error cargando todos los comentarios:', error)
    });
  }

  cargarComentarios() {
    const start = this.currentPage * this.limit;
    this.commentService.getComments(start, this.limit).subscribe({
      next: (newComments) => {
        if (this.currentPage === 0) {
          this.comments = newComments;
        } else {
          this.comments = [...this.comments, ...newComments];
        }
        this.aplicarFiltro();
        this.hasMore = newComments.length === this.limit;
      },
      error: (error) => console.error('Error cargando comentarios:', error)
    });
  }

  toggleFiltroMisComentarios() {
    this.mostrarSoloMisComentarios = !this.mostrarSoloMisComentarios;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.mostrarSoloMisComentarios && this.currentUserId) {
      this.filteredComments = this.allComments.filter(
        comment => comment.userId === this.currentUserId
      );
    } else {
      this.filteredComments = [...this.comments];
    }
  }

  cargarMas() {
    this.currentPage++;
    this.cargarComentarios();
  }

  navegarACrear() {
    this.router.navigate(['/create-comments']);
  }

  get textoBotonFiltro(): string {
    return this.mostrarSoloMisComentarios ? 'Mostrar todos' : 'Mostrar mis comentarios';
  }

  puedeEliminar(comment: Comment): boolean {
    return this.currentUserId === comment.userId;
  }

  eliminarComentario(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(id).subscribe({
          next: () => {
            this.allComments = this.allComments.filter(comment => comment.id !== id);
            this.comments = this.comments.filter(comment => comment.id !== id);
            this.aplicarFiltro();
            this.comentarioEliminado(); 
          },
          error: (error) => {
            this.comentarioNoEliminado();
          }
        });
      }
    });
  }

  mostrarMenos() {
    this.currentPage = 0;
    this.comments = this.comments.slice(0, this.limit);
    this.aplicarFiltro();
    this.hasMore = true;
  }

  get mostrarBotonMenos(): boolean {
    return !this.mostrarSoloMisComentarios && this.filteredComments.length > this.limit;
  }

  get usuarioLogueado(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  async comentarioEliminado() {
    await Swal.fire('Comentario Eliminado', 'El comentario fue eliminado correctamente', 'success');
  }
  async comentarioNoEliminado() {
    await Swal.fire('Su comentario no fue eliminado', 'El comentario no fue eliminado correctamente', 'error');
  }
}
