import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Account } from '../../shared/models/account.model';
import { AccountService } from '../../shared/services/account.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';

@Component({
  selector: 'cs-account-sidebar',
  templateUrl: 'account-sidebar.component.html'
})
export class AccountSidebarComponent extends SidebarComponent<Account>{
  constructor(
    protected accountService: AccountService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(accountService, notificationService, route, router);
  }

  protected loadEntity(id: string): Observable<Account> {
    return this.accountService.get(id)
      .switchMap(vm => {
        if (vm) {
          return Observable.of(vm);
        } else {
          return Observable.throw(new EntityDoesNotExistError());
        }
      });
  }

}
