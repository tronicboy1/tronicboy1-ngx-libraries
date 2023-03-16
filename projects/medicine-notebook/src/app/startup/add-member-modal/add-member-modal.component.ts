import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'projects/ngx-firebase-user-platform/src/public-api';
import { map, switchMap } from 'rxjs';
import { FamilyService } from '../../family/family.service';

@Component({
  selector: 'startup-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.css'],
})
export class AddMemberModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private family = inject(FamilyService);

  readonly isFirstMember$ = this.auth.getUid().pipe(
    switchMap((uid) => this.family.getMembersFamily$(uid)),
    map((family) => family && family.memberIds.length === 0),
  );
  readonly modalTitle$ = this.isFirstMember$.pipe(
    map((isFirstMember) => (isFirstMember ? $localize`自信の情報を追加する` : $localize`家族の一員を追加する`)),
  );

  close() {
    this.router.navigate([''], { relativeTo: this.route.parent });
  }
}
