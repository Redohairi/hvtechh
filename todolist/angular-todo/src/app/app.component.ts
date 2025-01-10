import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './pages/todo/todo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //
}
