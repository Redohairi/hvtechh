// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

// Para standalone, se quiser forms local, importe a seguir:
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,                  // <-- standalone
  imports: [CommonModule, FormsModule], // <-- habilita ngIf, ngModel etc. localmente
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // res contém { access_token: '...' }
        this.authService.setToken(res.access_token);
        // Redireciona para /products
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMsg = 'Usuário ou senha inválidos';
        console.error(err);
      },
    });
  }
}
