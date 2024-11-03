import { UserService } from './../user.service';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../Interface/user';
import { HttpClientModule } from '@angular/common/http';
import { NavsinlogueoComponent } from '../navsinlogueo/navsinlogueo.component';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ver-perfil',
  standalone: true,
  imports: [
    HttpClientModule,
    NavlogueadoComponent,
    NavsinlogueoComponent,
    CommonModule,
    RouterModule
],
  providers: [UserService],
  templateUrl: './ver-perfil.component.html',
  styleUrl: './ver-perfil.component.css'
})

export class VerPerfilComponent implements OnInit {
  currentUser: any; // Define el tipo según lo que necesites
  usuario : User | null = null;
  showPassword = false;

  userService = inject(UserService);

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
        (error) => {
          console.error('Error al cargar el perfil:', error);
          // Maneja el error, tal vez mostrando un mensaje al usuario
        }
      );
    } else {
      console.error('No hay usuario en localStorage');
      // Manejar el caso donde no hay usuario, por ejemplo, redirigir a inicio de sesión
    }
  }

  getInitial(): string {
    return this.usuario?.nombre ? this.usuario.nombre.charAt(0).toUpperCase() : '?';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
