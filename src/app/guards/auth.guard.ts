import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth: AuthService = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};
