import { Routes } from '@angular/router';
import { TaskComponent } from '../features/task/task';
import { LoginComponent } from '../features/iam/login/login.component';
import { authGuard, noAuthGuard } from '../features/iam/login/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'task', component: TaskComponent, canActivate: [authGuard] },
];
