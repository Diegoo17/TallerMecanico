import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('currentUser'));
  isLoggedIn$ = this.loggedInSubject.asObservable();

  login(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
