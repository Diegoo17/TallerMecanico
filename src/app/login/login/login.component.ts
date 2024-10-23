import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  usernameError: string = '';
  passwordError: string = '';

  onClick(){
    this.usernameError = '';
    this.passwordError = '';

    let isCorrect = true;

    if (!this.username) {
      this.usernameError = 'El campo de username es requerido.';
      isCorrect = false;
    }

    if (!this.password) {
      this.passwordError = 'El campo de contraseña es requerido.';
      isCorrect = false;
    }


  }

}