import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../Interface/user';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map, Observable, firstValueFrom } from 'rxjs';
import { UserService } from '../../Service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-datos-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [UserService],
  templateUrl: './modificar-datos-perfil.component.html',
  styleUrls: ['./modificar-datos-perfil.component.css']
})
export class ModificarDatosPerfilComponent implements OnInit {
  editForm: FormGroup;
  usuario: User | null = null;
  submitted = false;
  mostrarPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    this.editForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.validarDominioEmail()
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ]],
      password: ['', [
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[0-9]/)
      ]]
    });
  }

  get f() { return this.editForm.controls; }

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      this.editForm.patchValue({
        nombre: this.usuario?.nombre || '',
        username: this.usuario?.username || '',
        email: this.usuario?.email || '',
        telefono: this.usuario?.telefono || '',
        password: ''
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    const updatedFields: Partial<User> = {};
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control && control.value !== '' && control.value !== this.usuario![key as keyof User]) {
        updatedFields[key as keyof User] = control.value;
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      this.noHayCambios()
      return;
    }

    const verificaciones: Promise<boolean>[] = [];

    if (updatedFields.email) {
      verificaciones.push(
        firstValueFrom(this.verificacionEmailExistente(updatedFields.email))
      );
    }

    if (updatedFields.telefono) {
      verificaciones.push(
        firstValueFrom(this.verificacionTelefonoExistente(updatedFields.telefono))
      );
    }

    Promise.all(verificaciones)
      .then(results => {
        const [emailExists, telefonoExists] = results;

        if (emailExists) {
          this.editForm.get('email')?.setErrors({ emailExists: true });
          return;
        }

        if (telefonoExists) {
          this.editForm.get('telefono')?.setErrors({ telefonoExists: true });
          return;
        }

        this.actualizarPerfil(updatedFields);
      })
      .catch(error => {
        console.error('Error en las verificaciones:', error);
        this.errorVerificacionDeDatos()
      });
  }

  private validarDominioEmail() {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (email && !email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')) {
        return { dominioInvalido: true };
      }
      return null;
    };
  }

  verificacionEmailExistente(email: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?email=${email}`)
      .pipe(map(users => users.some(user => user.id !== this.usuario?.id && user.email === email)));
  }

  verificacionTelefonoExistente(telefono: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?telefono=${telefono}`)
      .pipe(map(users => users.some(user => user.id !== this.usuario?.id && user.telefono === telefono)));
  }

  private actualizarPerfil(updatedFields: Partial<User>) {
    this.userService.actualizarDatosPerfil(this.usuario!.id!, updatedFields).subscribe({
      next: (response) => {
        const updatedUser = {
          ...this.usuario!,
          ...updatedFields
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.perfilActualizado()
        this.router.navigate(['/ver-perfil']);
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.perfilNoActualizado()
      }
    });
  }


  async noHayCambios() {
    await Swal.fire('No hay cambios', 'No existen cambios para guardar', 'question');
  }
  
  async errorVerificacionDeDatos() {
    await Swal.fire('Error', 'Error al verificar los datos', 'error');
  }
  
  async perfilActualizado() {
    await Swal.fire('Perfil Actualizado', 'El perfil fue actualizado correctamente', 'success');
  }
  async perfilNoActualizado() {
    await Swal.fire('Error', 'El perfil no fue actualizado correctamente', 'error');
  }
  
  



}
