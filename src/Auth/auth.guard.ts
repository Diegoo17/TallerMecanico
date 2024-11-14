
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/Service/auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
