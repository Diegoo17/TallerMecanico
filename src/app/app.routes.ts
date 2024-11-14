import { CatalogComponent } from './Page/catalog/catalog.component';
import { CatalogUserViewComponent } from './Page/catalog.view/catalog.view.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './Page/login/login.component';
import { RegisterComponent } from './Page/register/register.component';
import { HomeComponent } from './Page/home/home.component';
import { VerPerfilComponent } from './Page/ver-perfil/ver-perfil.component';
import { ModificarDatosPerfilComponent } from './Page/modificar-datos-perfil/modificar-datos-perfil.component';
import { CreateCommentsComponent } from './Page/create-comments/create-comments.component';
import { DisplayCommentsComponent } from './Component/display-comments/display-comments.component';
import { ReservaTurnoFormComponent } from './Page/reserva-turno-form/reserva-turno-form.component';
import { ListarTodosLosTurnosComponent } from './Page/listar-todos-los-turnos/listar-todos-los-turnos.component';
import { ListarMisTurnosComponent } from './Page/listar-mis-turnos/listar-mis-turnos.component';
import { ModificarTurnoComponent } from './Page/modificar-turno/modificar-turno.component';
import { authGuard } from '../Auth/auth.guard';


export const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'catalog', component: CatalogComponent,canActivate:[authGuard]},
  {path: 'profile', component: VerPerfilComponent, canActivate:[authGuard]},
  {path: 'edit-profile', component: ModificarDatosPerfilComponent, canActivate:[authGuard]},
  {path: 'create-comments', component: CreateCommentsComponent, canActivate:[authGuard]},
  {path: 'display-comments', component: DisplayCommentsComponent},
  {path: 'catalogview', component: CatalogUserViewComponent},
  {path: 'reservarTurno', component: ReservaTurnoFormComponent, canActivate:[authGuard]},
  {path: 'turnos', component: ListarTodosLosTurnosComponent, canActivate:[authGuard]},
  {path: 'misTurnos', component: ListarMisTurnosComponent, canActivate:[authGuard]},
  {path: 'modificar-turno/:id', component: ModificarTurnoComponent, canActivate:[authGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];
