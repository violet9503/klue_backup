import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './user.service';
import { SharedService } from './shared-service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-root',
  template: `
    <menubar></menubar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-modal class="fade" [class.in]="isOpen" (ModalOut)="openModal($event)" [state]="state"></app-modal>
  `,
  styleUrls : ['./app.component.css']
})

export class AppComponent implements OnInit{
  isOpen:boolean = false;
  state:string = "close";

  constructor(private router: Router, private userService: UserService, private sharedService: SharedService){
    sharedService.changeState$.subscribe(
      state => {
        this.openModal(state);
      });
  }

  ngOnInit() {
    this.userService.isLogin().subscribe(data => {
      console.log(data);
      if(data.code == 200){
        this.userService.userInfo = data.data;
        if(data.data.profile){
          this.userService.userInfo.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+data.data.profile;
        }else
          this.userService.userInfo.profile = "/assets/img/Profile_Default.png";

        this.sharedService.loginChange(true);
      } else {
        this.userService.userInfo = null;
        this.sharedService.loginChange(false);
      }
    });

    //라우팅시 스크롤 초기화
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  openModal(state: string){
    let body = document.getElementsByTagName('body')[0];
    this.state = state;

    if(state == 'close'){
      this.isOpen = false;
      body.classList.remove("modal-open"); //remove the class
    }else{
      body.classList.add("modal-open"); //add the class
      this.isOpen = true;
    }
  }
}
