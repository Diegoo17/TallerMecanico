import { UserService } from '../../Service/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interface/user';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ver-perfil',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule
],
  providers: [UserService],
  templateUrl: './ver-perfil.component.html',
  styleUrl: './ver-perfil.component.css'
})

export class VerPerfilComponent implements OnInit {
  currentUser: any;
  usuario : User | null = null;
  showPassword = false;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.userService.getUsuarioByUserName(this.currentUser.username).subscribe(
        (data) => {
          this.usuario = data || null;
        },
        (error:Error) => {
          console.error('Error al cargar el perfil:', error);

        }
      );
    } else {
      console.error('No hay usuario en localStorage');

    }
  }

  getInitial(): string {
    return this.usuario?.nombre ? this.usuario.nombre.charAt(0).toUpperCase() : '?';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
