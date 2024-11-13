import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../Interface/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
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

    this.verificacionUsernameExistente(username).subscribe({
      next: (users) => {
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/home']);
        } else {
          this.loginForm.get('password')?.setErrors({ incorrect: true });
        }
      } else {
        this.loginForm.get('username')?.setErrors({ usernameExists: true });
      }
    },
    error: (err:Error)=>{
      console.error(err.message)
    }
  });
  }

  verificacionUsernameExistente(username: string): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/users?username=${username}`);
  }

  goMenuTurnos() {
    this.router.navigate(['/turnos']);
  }
}
