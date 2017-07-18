import { Action, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { TAppState } from '../reducers/index';
import { replace, routerActions } from '@ngrx/router-store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isAuthenticated } from '../selectors/auth';
import { AUTH_LOG_IN, AUTH_LOG_OUT, AUTH_REFRESH_SESSION } from '../actions/auth';
import { AuthService } from '../shared/services/auth.service';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { Location } from '@angular/common';


const PUBLIC_CONTEXTS = [
  '/login'
];

const isPublicUrl = (path: string) => {
  console.log(path);
  return PUBLIC_CONTEXTS.reduce((result, publicContext) => {
    return result || path.startsWith(publicContext);
  }, false);
};


@Injectable()
export class RoutingEffects {
  isAuthenticated$ = this.store.select(isAuthenticated);

  // @Effect()
  // login$: Observable<Action> = this.actions$
  //   .ofType(AUTH_LOG_IN)
  //   .map((a) => this.redirectToIndexAction(a));

  // @Effect()
  // authSuccess$: Observable<Action> = this.actions$
  //   .ofType(AUTH_REFRESH_SESSION)
  //   .map(a => this.redirectToIndexAction(a));

  @Effect()
  logout$: Observable<Action> = this.isAuthenticated$
  // .filter(action => !isPublicUrl(this.router.routerState.snapshot.url))
  // .withLatestFrom(this.isAuthenticated$)
    .filter((isAuthenticated) => !isAuthenticated)
    .map(() => this.redirectToLoginAction());

  @Effect()
  authLogOutRedirect$: Observable<Action> = this.actions$
    .ofType(AUTH_LOG_OUT)
    .do(() => this.authService.logout());

  redirectToIndexAction(a) {
    // debugger;
    // console.log(a);
    const next = this.route.snapshot.queryParams['next'] || '';
    // this.router.navigateByUrl(next);
    return replace(next);
  };

  redirectToLoginAction() {
    return replace('/login')
  };

  constructor(private actions$: Actions,
              private location: Location,
              private routerUtilsService: RouterUtilsService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private store: Store<TAppState>) {
  }
}
