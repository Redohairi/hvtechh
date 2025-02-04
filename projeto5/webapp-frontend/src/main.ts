import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    // Em vez de { provide: FormsModule, useValue: true }, use importProvidersFrom:
    importProvidersFrom(FormsModule, ReactiveFormsModule),
  ],
});
