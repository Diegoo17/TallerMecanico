import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class RegisterComponent {
  nombre: string = '';
  username: string = '';
  email: string = '';
  telefono: string = '';
  password: string = '';
  nombreError: string = '';
  usernameError: string = '';
  emailError: string = '';
  telefonoError: string = '';
  passwordError: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.nombreError = '';
    this.usernameError = '';
    this.emailError = '';
    this.telefonoError = '';
    this.passwordError = '';

    let isValid = true;

    if (!this.nombre) {
      this.nombreError = 'El campo de nombre es requerido.';
      isValid = false;
    }

    if (!this.username) {
      this.usernameError = 'El campo de username es requerido.'; 
      isValid = false; 
    }

    if (!this.email) {
      this.emailError = 'El campo de email es requerido.'; 
      isValid = false; 
    } else if (!this.email.endsWith("@gmail.com") && !this.email.endsWith("@hotmail.com")) {
      this.emailError = "Email en formato invalido.";
      isValid = false; 
    }

    if (!this.telefono) {
      this.telefonoError = 'El campo de teléfono es requerido.'; 
      isValid = false; 
    }

    if (!this.password) {
      this.passwordError = 'El campo de contraseña es requerido.';
      isValid = false;
    }
    if (isValid) {
      this.verificacionEmailExistente(this.email).subscribe(emailExists => {
        if (emailExists) {
          this.emailError = 'El correo electrónico ya está registrado.';
        } else {
          this.verificacionUsernameExistente(this.username).subscribe(usernameExists => {
            if (usernameExists) {
              this.usernameError = 'El nombre de usuario ya está en uso.';
            } else {
              this.verificacionTelefonoExistente(this.telefono).subscribe(telefonoExists => {
                if (telefonoExists) {
                  this.telefonoError = 'El número de teléfono ya está registrado.';
                } else {
                  this.guardarUsuario();
                }
              });
            }
          });
        }
      });
    }
  }

  verificacionEmailExistente(email: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  verificacionUsernameExistente(username: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }

  verificacionTelefonoExistente(telefono: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?telefono=${telefono}`).pipe(
      map(users => users.length > 0)
    );
  }

  guardarUsuario() {
    const nuevoUsuario = {
      nombre: this.nombre,
      username: this.username,
      email: this.email,
      telefono: this.telefono,
      password: this.password,
    };

    this.http.post('http://localhost:3000/users', nuevoUsuario).subscribe({
      next: () => {
        alert("Registro exitoso!");
        
        
        
        ///ACA SE TENDRIA QUE MANDAR AL MENU DE USUARIO



        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al guardar el usuario:', error);
        alert('Error al registrar el usuario, por favor intenta de nuevo.');
      },
    });
  }

  limpiarFormulario() {
    this.nombre = '';
    this.username = '';
    this.email = '';
    this.telefono = '';
    this.password = '';
  }
}
