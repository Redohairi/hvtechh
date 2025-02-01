import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Welcome to the Home Page</h1>
    <button [routerLink]="['/products']">CRUD</button>
  `
})
export class HomeComponent {
}
