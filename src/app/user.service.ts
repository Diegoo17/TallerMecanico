import { User } from './Interface/user';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  http = inject(HttpClient);
  urlBase = 'http://localhost:3000/users';

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.urlBase);
  }

  getUsuarioById(id: string | null): Observable<User>{
    return this.http.get<User>(`${this.urlBase}/${id}`);
  }

  getUsuarioByUserName(nombre: string | null): Observable<User | undefined>{
    return this.getUsuarios().pipe(
        map(users => users.find(user => user.username === nombre))
    );
  }

  postUsuario(usuario: User): Observable<User> {
    return this.http.post<User>(this.urlBase, usuario);
  }

  deleteUsuario(id: string): Observable<User> {
    return this.http.delete<User>(`${this.urlBase}/${id}`);
  }

  updateUsuario(id: string | null, usuario: User): Observable<User> {
    return this.http.put<User>(`${this.urlBase}/${id}`, usuario);
  }
}
