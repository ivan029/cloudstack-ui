import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdlDialogService } from '../dialog/dialog-module';
import { AuthService } from '../shared/services';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { TAppState } from '../reducers/index';
import { Store } from '@ngrx/store';
import { AuthLogOutAction } from '../actions/auth';


@Component({
  selector: 'cs-logout',
  template: '<div></div>'
})
export class LogoutComponent implements OnInit {
  constructor(
    private store: Store<TAppState>
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new AuthLogOutAction());
  }
}
