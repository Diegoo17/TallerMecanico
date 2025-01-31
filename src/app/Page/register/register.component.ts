import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  marcas: string[] = ['Toyota', 'Ford', 'Honda', 'BMW', 'Mercedes'];
  marcaSeleccionada: string = '';
  otraMarca: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {


    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      username: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email, this.validarDominioEmail()],
      ],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      marca: ['', Validators.required],

    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, username, telefono } = this.registerForm.value;

    this.verificacionEmailExistente(email).subscribe({
      next:(emailExists) => {
      if (emailExists) {
        this.registerForm.get('email')?.setErrors({ emailExists: true });
      } else {
        this.verificacionUsernameExistente(username).subscribe(
          (usernameExists) => {
            if (usernameExists) {
              this.registerForm.get('username')?.setErrors({
                usernameExists: true,
              });
            } else {
              this.verificacionTelefonoExistente(telefono).subscribe(
                (telefonoExists) => {
                  if (telefonoExists) {
                    this.registerForm.get('telefono')?.setErrors({
                      telefonoExists: true,
                    });
                  } else {
                    this.guardarUsuario();
                  }
                }
              );
            }
          }
        );
      }
    },
    error:(err:Error)=>{
    console.error(err.message);
    }
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
    return this.http
      .get<any[]>(`http://localhost:3000/users?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }

  verificacionUsernameExistente(username: string): Observable<boolean> {
    return this.http
      .get<any[]>(`http://localhost:3000/users?username=${username}`)
      .pipe(map((users) => users.length > 0));
  }

  verificacionTelefonoExistente(telefono: string): Observable<boolean> {
    return this.http
      .get<any[]>(`http://localhost:3000/users?telefono=${telefono}`)
      .pipe(map((users) => users.length > 0));
  }
  guardarUsuario() {
    const nuevoUsuario = this.registerForm.value;

    this.http.post('http://localhost:3000/users', nuevoUsuario).subscribe({
      next: () => {
        this.registroExitoso()
        this.goLogin();
        this.registerForm.reset();
      },
      error: (error:Error) => {
        console.error('Error al guardar el usuario:', error);
        this.errorRegistro()
      },
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
  async registroExitoso() {
    await Swal.fire('Registro Exitoso', 'El usuario fue registrado correctamente', 'success');
  }
  async errorRegistro() {
    await Swal.fire('Error', 'El registro falló', 'error');
  }


  onMarcaChange() {
    if (this.registerForm.get('marca')?.value !== 'Otro') {
      this.registerForm.get('otraMarca')?.setValue('');
    }
  }
}
