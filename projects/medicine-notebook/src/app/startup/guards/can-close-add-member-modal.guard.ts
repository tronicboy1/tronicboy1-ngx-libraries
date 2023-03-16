import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from 'projects/ngx-firebase-user-platform/src/public-api';
import { first, map, switchMap } from 'rxjs';
import { GroupService } from '../../group/group.service';
import { MemberService } from '../../group/member.service';

export const canCloseAddMemberModalGuard: CanDeactivateFn<unknown> = (
  _component,
  _currentRoute,
  _currentState,
  _nextState,
) => {
  const auth = inject(AuthService);
  const group = inject(GroupService);
  const member = inject(MemberService);
  return auth.getUid().pipe(
    first(),
    switchMap((uid) => group.getMembersGroup$(uid)),
    map((group) => {
      if (!group) throw ReferenceError('NoGroup');
      return group;
    }),
    switchMap((group) => member.getGroupMembers$(group.id)),
    map((members) => members.length > 0),
  );
};
