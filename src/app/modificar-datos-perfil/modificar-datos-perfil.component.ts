import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../Interface/user';
import { CommonModule } from '@angular/common';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { NavsinlogueoComponent } from '../navsinlogueo/navsinlogueo.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-modificar-datos-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    NavlogueadoComponent, 
    NavsinlogueoComponent,
    HttpClientModule
  ],
  providers: [UserService],
  templateUrl: './modificar-datos-perfil.component.html',
  styleUrls: ['./modificar-datos-perfil.component.css']
})
export class ModificarDatosPerfilComponent implements OnInit {
  editForm!: FormGroup;
  usuario: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.initForm();
  }

  private initForm(): void {
    this.editForm = this.formBuilder.group({
      nombre: [''],
      email: [''],
      telefono: [''],
      password: ['']
    });
  }

  private loadUserProfile(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      this.editForm.patchValue({
        nombre: this.usuario?.nombre,
        email: this.usuario?.email,
        telefono: this.usuario?.telefono,
        password: this.usuario?.password
      });
    }
  }

  onSubmit(): void {
    if (!this.usuario) return;

    // Crear objeto con solo los campos modificados
    const updatedFields: Partial<User> = {};
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control && control.value !== '' && control.value !== this.usuario![key as keyof User]) {
        updatedFields[key as keyof User] = control.value;
      }
    });

    // Si no hay campos modificados, no hacemos nada
    if (Object.keys(updatedFields).length === 0) {
      alert('No hay cambios para guardar');
      return;
    }

    // Usar la nueva función del servicio
    this.userService.actualizarDatosPerfil(this.usuario.id!, updatedFields).subscribe({
      next: (response) => {
        // Actualizar localStorage con los nuevos datos
        const updatedUser = {
          ...this.usuario!,
          ...updatedFields
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Perfil actualizado exitosamente');
        this.router.navigate(['/ver-perfil']);
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }
}
