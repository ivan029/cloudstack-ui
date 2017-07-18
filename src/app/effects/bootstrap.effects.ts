import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TAppState } from '../reducers/index';
import {
  AUTH_BOOTSTRAP, AuthLogInAction, AuthRefreshSessionAction,
  BootstrapAction
} from '../actions/auth';
@Injectable()
export class BootstrapEffects {
  // isAuthenticated$ = this.store.select(isAuthenticated);

  // @Effect()
  // bootstrap$: Observable<Action> = this.actions$
  //   .ofType(AUTH_BOOTSTRAP)
  //   .startWith(new BootstrapAction())
  //   .switchMap(() => this.authService.sendRefreshRequest())
  //   .map(users => users[0])
  //   .map(user => new AuthRefreshSessionAction(user)); // todo !!!

  // @Effect()
  // logOut$: Observable<Action> = this.actions$
  //   .ofType(AUTH_)
  // .startWith(bootstrapAction())
  // .switchMap(() => this.authService.sendRefreshRequest())
  // .map(users => users[0])
  // .map(user => new AuthLogInAction(user));


  constructor(private actions$: Actions,
              private authService: AuthService,
              private store: Store<TAppState>) {
  }
}
