import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const unauthenticatedGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService);
  const router : Router = inject(Router);

  const userData = authService.userData;

  if(!userData) {
    return true;
  }

  router.navigateByUrl('/admin');
  return false;
};
