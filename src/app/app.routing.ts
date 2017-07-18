import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { EventListComponent } from './events/event-list.component';
import { SgTemplateListComponent } from './security-group/sg-template-list/sg-template-list.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard, LoginGuard } from './shared/services';
import { SshKeysPageComponent } from './ssh-keys/ssh-keys-page.component';
import { ReloadComponent } from './shared/components/reload/reload.component';


const publicRoutes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'reload',
    component: ReloadComponent
  }
];

const protectedRoutes = [
  {
    path: '',
    redirectTo: 'instances',
    pathMatch: 'full',
  },
  {
    path: 'sg-templates',
    component: SgTemplateListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ssh-keys',
    component: SshKeysPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'instances'
  }
];

export const routes: Routes = [
  ...publicRoutes,
  ...protectedRoutes
];
