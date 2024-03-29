import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'projects/ngx-firebase-user-platform/src/public-api';

@Component({
  selector: 'app-home-base',
  templateUrl: './home-base.component.html',
  styleUrls: ['./home-base.component.css'],
})
export class HomeBaseComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly route = inject(ActivatedRoute);

  handleLogoutClick() {
    this.authService.signOutUser().then(() => this.router.navigate(['/auth']));
  }
}
