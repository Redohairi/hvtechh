import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <h1>Meu WebApp Angular - CRUD de Produtos</h1>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
