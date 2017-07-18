import { Action } from '@ngrx/store';

export const AUTH_REFRESH_SESSION = '[Auth] Refresh Session';

export class AuthRefreshSessionAction implements Action {
  readonly type = AUTH_REFRESH_SESSION;

  constructor(public payload: any) {
  }
}
export const AUTH_LOG_IN = '[Auth] Log In';

export class AuthLogInAction implements Action {
  readonly type = AUTH_LOG_IN;

  constructor(public payload: any) {
  }
}

export const AUTH_LOG_OUT = '[Auth] Log Out';

export class AuthLogOutAction implements Action {
  readonly type = AUTH_LOG_OUT;
}

export const AUTH_SESSION_EXPIRED = '[Auth] Session Expired';

export class AuthSessionExpiredAction implements Action {
  readonly type = AUTH_SESSION_EXPIRED;
}


export const AUTH_BOOTSTRAP = '[Auth] Bootstrap';

export class BootstrapAction implements Action {
  readonly type = AUTH_BOOTSTRAP;
}


