import { Component } from '@angular/core';
import { SharedService } from '../shared-service';

@Component({
  selector: 'menubar-guest',
  template: `
    <span class="index-menubar-detail" (click)="stateChange('signup')">회원가입</span>
    <span class="index-menubar-detail" (click)="stateChange('login')">로그인</span>
  `,
  styleUrls: ['./menubar-guest.component.css']
})
export class MenubarGuestComponent {
  constructor( private sharedService: SharedService ) { }

  stateChange(state:string){
    this.sharedService.stateChange(state);
  }
}
