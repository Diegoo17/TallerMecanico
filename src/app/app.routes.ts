import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { ModificarDatosPerfilComponent } from './modificar-datos-perfil/modificar-datos-perfil.component';
import { CreateCommentsComponent } from './create-comments/create-comments.component';
import { DisplayCommentsComponent } from './display-comments/display-comments.component';


export const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'profile', component: VerPerfilComponent},
  {path: 'edit-profile', component: ModificarDatosPerfilComponent},
  {path: 'create-comments', component: CreateCommentsComponent},
  {path: 'display-comments', component: DisplayCommentsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];
