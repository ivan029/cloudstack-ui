import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators';
import { BaseModelStub } from '../models';
import { AsyncJobService } from './async-job.service';

import { BaseBackendService } from './base-backend.service';
import { ConfigService } from './config.service';
import { RouterUtilsService } from './router-utils.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

const DEFAULT_SESSION_REFRESH_INTERVAL = 60;

@Injectable()
@BackendResource({
  entity: '',
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  private refreshTimer: any;
  private numberOfRefreshes = 0;
  private inactivityTimeout: number;
  private sessionRefreshInterval = DEFAULT_SESSION_REFRESH_INTERVAL;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected configService: ConfigService,
    protected storage: StorageService,
    protected router: Router,
    protected userService: UserService,
    protected routerUtilsService: RouterUtilsService,
    protected zone: NgZone
  ) {
    super();
  }

  public startInactivityCounter() {
    Observable.forkJoin(
      this.getInactivityTimeout(),
      this.getSessionRefreshInterval()
    )
      .subscribe(([inactivityTimeout, sessionRefreshInterval]) => {
        this.inactivityTimeout = inactivityTimeout;
        this.sessionRefreshInterval = sessionRefreshInterval;
        this.resetInactivityTimer();
        this.addEventListeners();
      });
  }

  public setInactivityTimeout(value: number): Observable<void> {
    return this.userService.writeTag('sessionTimeout', value.toString())
      .map(() => {
        this.inactivityTimeout = value;
        this.resetInactivityTimer();
      });
  }

  public getInactivityTimeout(): Observable<number> {
    if (this.inactivityTimeout) {
      return Observable.of(this.inactivityTimeout);
    }

    return this.userService.readTag('sessionTimeout')
      .switchMap(timeout => {
        const convertedTimeout = +timeout;

        if (Number.isNaN(convertedTimeout)) {
          const newTimeout = 0;
          return this.userService
            .writeTag('sessionTimeout', newTimeout.toString())
            .map(() => newTimeout);
        } else {
          return Observable.of(convertedTimeout);
        }
      });
  }

  public login(username: string, password: string, domain?: string): Observable<void> {
    return this.postRequest('login', { username, password, domain })
      .map(res => this.getResponse(res))
      .catch((error) => this.handleCommandError(error));
  }

  public logout(): Observable<void> {
    return this.postRequest('logout')
      .catch(error => {
        this.error.send(error);
        return Observable.throw('Unable to log out.');
      });
  }
  public sendRefreshRequest(): Observable<Array<BaseModelStub>> {
    return this.userService.getList();
  }

  private refreshSession(): void {
    if (++this.numberOfRefreshes * this.sessionRefreshInterval >= this.inactivityTimeout * 60) {
      this.clearInactivityTimer();
      this.zone.run(() => this.router.navigate(['/logout'], this.routerUtilsService.getRedirectionQueryParams()));
    } else {
      this.sendRefreshRequest().subscribe();
    }
  }

  private addEventListeners(): void {
    const events = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'.split(' ');
    const observables = events.map(event => Observable.fromEvent(document, event));
    this.zone.runOutsideAngular(() => {
      Observable.merge(...observables).subscribe(() => this.resetInactivityTimer());
    });
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();
    this.numberOfRefreshes = 0;
    if (this.inactivityTimeout) {
      this.setInactivityTimer();
    }
  }

  public clearInactivityTimer(): void {
    clearInterval(this.refreshTimer);
  }

  private setInactivityTimer(): void {
    if (this.sessionRefreshInterval && this.inactivityTimeout) {
      this.refreshTimer = setInterval(this.refreshSession.bind(this), this.sessionRefreshInterval * 1000);
    }
  }

  private getSessionRefreshInterval(): Observable<number> {
    return this.configService.get('sessionRefreshInterval')
      .map(refreshInterval => {
        if (Number.isInteger(refreshInterval) && refreshInterval > 0) {
          return refreshInterval;
        } else {
          return DEFAULT_SESSION_REFRESH_INTERVAL;
        }
      });
  }
}
