import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule],
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


  constructor(private http: HttpClient, private router: Router) {}

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
    } else if (this.telefono.length != 10) {
      this.telefonoError = "El número de teléfono debe contener 10 dígitos.";
      isValid = false;
    } else if(/0-9/.test(this.telefono)){
      this.telefonoError = "El telefono debe constar unicamente de numeros"
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'El campo de contraseña es requerido.';
      isValid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'La contraseña debe contener al menos 8 caracteres.';
      isValid = false;
    } else if (this.password.length > 16) {
      this.passwordError = 'La contraseña debe contener menos de 16 caracteres.';
      isValid = false;
    } else if (!/[a-z]/.test(this.password)) {
      this.passwordError = 'La contraseña debe contener al menos una letra minúscula.';
      isValid = false;
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'La contraseña debe contener al menos una letra mayúscula.';
      isValid = false;
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'La contraseña debe contener al menos un número.';
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

   //ESTAS FUNCIONES VAN EN EL USUARIO.SERVICE.TS
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

        //LOGIN DEBERIA ENVIAR AL MENU DE TURNOS
        this.goLogin();

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

  
  //Funcion que hace el refresco de pantalla y envia a la otra interfaz
  goLogin(){
    this.router.navigate(['/login']);
  }
}
