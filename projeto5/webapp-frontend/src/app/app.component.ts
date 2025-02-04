import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  selector: 'app-root',
  template: `
    <h1>CRUD de Produtos</h1>
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
