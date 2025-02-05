import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f0f0f0;">
      <div>
        <a routerLink="/" style="margin-right: 1rem; text-decoration: none; color: #333;">Home</a>
        <a routerLink="/products" *ngIf="authService.isLoggedIn()"
           style="margin-right: 1rem; text-decoration: none; color: #333;">
          Produtos
        </a>
      </div>
      <div style="display: flex; align-items: center;">
        <span *ngIf="authService.isLoggedIn()"
              style="margin-right: 1rem; color: #333;">
          Olá, {{ authService.getUserName() }} ({{ authService.getUserRole() }})
        </span>
        <button *ngIf="authService.isLoggedIn()"
                (click)="onLogout()"
                style="padding: 0.5rem 1rem; border: none; background: #007bff; color: #fff; cursor: pointer; border-radius: 4px; margin-right: 1rem;">
          Sair
        </button>
        <a routerLink="/login" *ngIf="!authService.isLoggedIn()"
           style="text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #007bff; border-radius: 4px; color: #007bff;">
          Login
        </a>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
