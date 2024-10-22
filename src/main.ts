import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
imports: [FormsModule, HttpClientModule]
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
