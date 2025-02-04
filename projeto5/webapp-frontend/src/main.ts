import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { authInterceptor } from './app/auth/auth.interceptor';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
  ],
});
