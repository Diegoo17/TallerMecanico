import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { ModificarDatosPerfilComponent } from './modificar-datos-perfil/modificar-datos-perfil.component';
import { CreateCommentsComponent } from './create-comments/create-comments.component';
import { DisplayCommentsComponent } from './display-comments/display-comments.component';
import { ReservaTurnoFormComponent } from './reserva-turno-form/reserva-turno-form.component';
import { ListarTodosLosTurnosComponent } from './listar-todos-los-turnos/listar-todos-los-turnos.component';
import { CatalogUserViewComponent } from './catalog.view/catalog.view.component';
import { ListarMisTurnosComponent } from './listar-mis-turnos/listar-mis-turnos.component';
import { ModificarTurnoComponent } from './modificar-turno/modificar-turno.component';


export const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'profile', component: VerPerfilComponent},
  {path: 'edit-profile', component: ModificarDatosPerfilComponent},
  {path: 'create-comments', component: CreateCommentsComponent},
  {path: 'display-comments', component: DisplayCommentsComponent},
  {path: 'catalogview', component: CatalogUserViewComponent},
  {path: 'reservarTurno', component: ReservaTurnoFormComponent},
  {path: 'turnos', component: ListarTodosLosTurnosComponent},
  {path: 'misTurnos', component: ListarMisTurnosComponent},
  {path: 'modificar-turno/:id', component: ModificarTurnoComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];
