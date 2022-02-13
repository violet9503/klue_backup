import { Component, Input } from '@angular/core';
import { SharedService } from '../shared-service';

@Component({
  selector: 'modal-contents',
  template: `
    <div [ngSwitch]="state">
      <modal-signup *ngSwitchCase="'signup'" [next]="next"></modal-signup>
      <modal-login *ngSwitchCase="'login'" (snsClick)="snsSignUp()"></modal-login>
      <modal-loss *ngSwitchCase="'loss'"></modal-loss>
      <modal-complete *ngSwitchCase="'complete'"></modal-complete>
      <modal-confirm *ngSwitchCase="'confirm'"></modal-confirm>
      <modal-report *ngSwitchCase="'report'"></modal-report>
      <modal-charge *ngSwitchCase="'charge'"></modal-charge>
      <modal-check *ngSwitchCase="'check'"></modal-check>
      <modal-nickname *ngSwitchCase="'nickname'"></modal-nickname>
      <modal-auth *ngSwitchCase="'auth'"></modal-auth>
      <modal-close *ngSwitchCase="'close'"></modal-close>
    </div>
  `
})
export class ModalContentsComponent {
    @Input() state: string;
    next:boolean = false;

    constructor( private sharedService: SharedService ) { }

  snsSignUp(){
      this.next = true;
      this.sharedService.stateChange('signup');
    }
}
