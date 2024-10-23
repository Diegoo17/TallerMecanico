import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  usernameError: string = '';
  passwordError: string = '';

  goMenuTurnos(){
    this.router.navigate(['/turnos']);
  }

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

    if(isCorrect){
      this.verificacionUsernameExistente(this.username).subscribe(usernameEquals => {
        if(!usernameEquals){
          this.usernameError = 'El Usuario es INCORRECTO.';
        }else {
          this.verificacionContraseñaExistente(this.password).subscribe(passwordEquals => {
            if(!passwordEquals){
              this.passwordError = 'La Contraseña es INCORRECTA.';
            }else{

              //Cuando creemos los turnos esta funcion va a dirigir una vez iniciada sesion de usuario
              //this.goMenuTurnos();

            }
          })
        }
      })
    }

  }


  constructor(private http: HttpClient, private router: Router) {}



  verificacionUsernameExistente(username: string): Observable<boolean> {
    return this.http.get<any[]>(`http://localhost:3000/users?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }

  verificacionContraseñaExistente(password: string): Observable<boolean>{
    return this.http.get<any[]>(`http://localhost:3000/users?password=${password}`).pipe(
      map(users => users.length > 0)
    );
  }

}
