import { TAppState } from '../reducers';
import { createSelector } from 'reselect';

export const getAuthState = (state: TAppState) => state.auth;

export const isAuthenticated = createSelector(getAuthState, state => !!(state.username && state.name && state.userId));

export const getUsername = createSelector(getAuthState, state => state.username);

export const getName = createSelector(getAuthState, state => state.name);

export const getUserId = createSelector(getAuthState, state => state.userId);
