import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentService } from '../../Service/comment.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  providers: [CommentService],
  templateUrl: './create-comments.component.html',
  styleUrls: ['./create-comments.component.css']
})
export class CreateCommentsComponent {
  commentForm: FormGroup;
  readonly MAX_DESCRIPCION_LENGTH = 280; // Límite de caracteres
  caracteresRestantes = this.MAX_DESCRIPCION_LENGTH;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.MAX_DESCRIPCION_LENGTH)
      ]]
    });

    // Suscribirse a los cambios en el campo descripción
    this.commentForm.get('descripcion')?.valueChanges.subscribe(value => {
      this.caracteresRestantes = this.MAX_DESCRIPCION_LENGTH - (value?.length || 0);
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        this.noInicioSesion()
        return;
      }

      const user = JSON.parse(userStr);
      const comment = {
        ...this.commentForm.value,
        userId: user.id,
        userName: user.nombre
      };

      this.commentService.createComment(comment).subscribe({
        next: () => {
          this.comentarioCreado()
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.comentarioNoCreado()
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }
  async comentarioCreado() {
    await Swal.fire('Comentario Creado', 'El comentario fue creado correctamente', 'success');
  }
  async comentarioNoCreado() {
    await Swal.fire('Su comentario no fue creado', 'El comentario no fue creado correctamente', 'error');
  }
  async noInicioSesion() {
    await Swal.fire('No inicio sesion', 'Tiene que haber iniciado sesion para realizar comentarios', 'error');
  }

}
