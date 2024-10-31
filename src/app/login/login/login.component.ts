import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavlogueadoComponent } from '../../navlogueado/navlogueado.component';
import { NavsinlogueoComponent } from '../../navsinlogueo/navsinlogueo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, NavlogueadoComponent,NavsinlogueoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onClick() {
    if (this.loginForm.invalid) {
      return;
    }
    
    const { username, password } = this.loginForm.value;

    this.verificacionUsernameExistente(username).subscribe((usernameExists) => {
      if (usernameExists) {
        this.verificacionContraseñaExistente(password).subscribe((passwordExists) => {
          if (passwordExists) {
            //this.goMenuTurnos();
            this.router.navigate(['/home']);
          } else {
            this.loginForm.get('password')?.setErrors({ incorrect: true });
          }
        });
      } else {
        this.loginForm.get('username')?.setErrors({ usernameExists: true });
      }
    });
  }

  verificacionUsernameExistente(username: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }

  verificacionContraseñaExistente(password: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?password=${password}`).pipe(
      map(users => users.length > 0)
    );
  }

  goMenuTurnos() {
    this.router.navigate(['/turnos']);
  }
}
