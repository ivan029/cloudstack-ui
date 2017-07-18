import * as fromAuth from './auth';
import * as fromRouter from '@ngrx/router-store';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface TAppState {
  auth: fromAuth.TAuthState;
  router: fromRouter.RouterState
}

const reducers = {
  auth: fromAuth.authReducer,
  router: fromRouter.routerReducer
};

const developmentReducer: ActionReducer<TAppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<TAppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
