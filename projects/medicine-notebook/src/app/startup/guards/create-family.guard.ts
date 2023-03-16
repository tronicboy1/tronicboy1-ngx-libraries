import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from 'projects/ngx-firebase-user-platform/src/public-api';
import { first, map, switchMap } from 'rxjs';
import { FamilyService } from '../../family/family.service';

export const createFamilyGuard: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const family = inject(FamilyService);
  const router = inject(Router);
  return auth.getUid().pipe(
    first(),
    switchMap((uid) => family.getMembersFamily$(uid)),
    map(Boolean),
    map((hasFamily) => !hasFamily || router.createUrlTree(['/startup', 'choose-mode'])),
  );
};