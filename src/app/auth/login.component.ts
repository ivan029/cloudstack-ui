import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';

import { AuthService, NotificationService } from '../shared';
import { ConfigService } from '../shared/services/config.service';
import { TAppState } from '../reducers/index';
import { Store } from '@ngrx/store';
import { AuthLogInAction } from '../actions/auth';
import { go, replace } from '@ngrx/router-store';


@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('user') public usernameField;
  @ViewChild('pass') public passwordField;

  public username = '';
  public password = '';
  public domain = '';
  public loading = true;

  public showDomain = false;

  constructor(
    private auth: AuthService,
    private store: Store<TAppState>,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService
  ) {
  }

  public ngOnInit(): void {
    this.configService.get('defaultDomain')
      .subscribe(domainFromConfig => {
        const domainFromQueryParams = this.route.snapshot.queryParams['domain'];
        this.domain = domainFromQueryParams || domainFromConfig || '';

        this.loading = false;
      });
  }

  public toggleDomain(): void {
    this.showDomain = !this.showDomain;
  }

  public onSubmit(): void {
    if (this.username && this.password) {
      this.login(this.username, this.password, this.domain);
      return;
    }
    if (!this.username) {
      this.setErrors(this.usernameField.control);
    }
    if (!this.password) {
      this.setErrors(this.passwordField.control);
    }
  }

  private setErrors(control: AbstractControl): void {
    control.setErrors({ required: true });
    control.markAsDirty();
  }

  private login(username: string, password: string, domain: string): void {
    this.auth
      .login(username, password, domain)
      .subscribe((res) => this.handleLogin(res), error => this.handleError(error));
  }

  private handleLogin(res: any): void {
    this.store.dispatch(new AuthLogInAction(res));
    const next = this.route.snapshot.queryParams['next'] || '';
    this.store.dispatch(go(next));
  }

  private handleError(error: any): void {
    this.notification.message({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
