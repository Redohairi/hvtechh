import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f0f0f0;">
      <div>
        <a routerLink="/" style="margin-right: 1rem;">Home</a>
        <a routerLink="/products" *ngIf="authService.isLoggedIn()">Produtos</a>
      </div>
      <div>
        <span *ngIf="authService.isLoggedIn()">
          Olá, {{ authService.getUserName() }} ({{ authService.getUserRole() }})
        </span>
        <button *ngIf="authService.isLoggedIn()" (click)="onLogout()">Sair</button>
        <a routerLink="/login" *ngIf="!authService.isLoggedIn()">Login</a>
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