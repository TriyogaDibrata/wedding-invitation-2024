import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiResponse } from '@interfaces/api-response';
import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public userData: User = this.authService.userData
    ? this.authService.userData
    : null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  async doLogout() {
    await this.authService.logout().subscribe({
      next: (res: ApiResponse) => {
        if (res && res.success) {
          this.router.navigateByUrl('/auth');
          this.alertService.showToast("success", 'Logged out !');
        }
      },
    });
  }
}
