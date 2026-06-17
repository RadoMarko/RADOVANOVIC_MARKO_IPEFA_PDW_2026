import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../security/security.service';

export function DashboardGuard(redirectRoute: string = ''): CanActivateFn {
  return () => {
    const service = inject(SecurityService);
    const router = inject(Router);

    return service.isConnected() || router.createUrlTree([redirectRoute]);
  };
}
