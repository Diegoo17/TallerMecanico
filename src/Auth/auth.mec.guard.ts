
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/Service/auth.service';
import { inject } from '@angular/core';


export const authMecGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userStr = localStorage.getItem('currentUser');

  if (!userStr) {
    router.navigate(['/home']);
    return false;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error('Error al parsear el usuario de localStorage:', error);
    router.navigate(['/home']);
    return false;
  }

  if (authService.isLoggedIn() && user.id === 'mec') {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
