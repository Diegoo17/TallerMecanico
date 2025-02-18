
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { User } from '../Interface/user';


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

  actualizarDatosPerfil(id: string, datosActualizados: Partial<User>): Observable<User> {
    return this.http.get<User>(`${this.urlBase}/${id}`).pipe(
      switchMap(usuarioActual => {
        const usuarioActualizado: User = {
          ...usuarioActual,
          nombre: datosActualizados.nombre || usuarioActual.nombre,
          email: datosActualizados.email || usuarioActual.email,
          telefono: datosActualizados.telefono || usuarioActual.telefono,
          password: datosActualizados.password || usuarioActual.password,
          marca: datosActualizados.marca || usuarioActual.marca
        };
        return this.http.put<User>(`${this.urlBase}/${id}`, usuarioActualizado);
      })
    );
  }
}
