import { Routes } from '@angular/router';
import { TaskComponent } from '../features/task/task';
import { AuthComponent } from '../features/iam/auth/auth.component';
import { authGuard, noAuthGuard } from '../features/iam/auth/application/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthComponent, canActivate: [noAuthGuard] },
  { path: 'task', component: TaskComponent, canActivate: [authGuard] },
];
