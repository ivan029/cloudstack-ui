import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { MdlPopoverComponent } from '@angular-mdl/popover';

import { BaseTemplateModel } from '../shared';
import { TAppState } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { getUsername } from '../../selectors/auth';


@Component({
  selector: 'cs-template',
  templateUrl: 'template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent {
  readonly isSelf$ = this.store.select(getUsername).map(username => username === this.template.account);
  @Input() public template: BaseTemplateModel;
  @Input() public isSelected: boolean;
  @HostBinding('class.single-line') @Input() public singleLine = true;
  @Input() public searchQuery: string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  constructor(private store: Store<TAppState>) {
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.template);
    } else {
      this.popoverComponent.hide();
    }
  }

  public get ready(): boolean {
    return this.template.isReady;
  }

  public removeTemplate(): void {
    this.deleteTemplate.next(this.template);
  }
}
