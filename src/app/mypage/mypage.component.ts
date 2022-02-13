import {Component, OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'mypage',
  template: `
    <div class="mypage-wrap">
        <mypage-header [url]="url"></mypage-header>
        <mypage-sidemenu [url]="url" *ngIf="!isMain"></mypage-sidemenu>
        <router-outlet></router-outlet>
        <div class="lecture-result-logo"><img src="/assets/img/KLUE_Logo_grey.png"/></div>
    </div>
  `,
  styleUrls: ['./mypage.component.css']
})
export class MypageComponent implements OnDestroy{
  isMain:boolean = false;
  url:string;
  savedObservable:any;
  constructor( private router: Router ) {
    this.savedObservable = router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        if(val.url == "/mypage")
          this.isMain = true;
        else
          this.isMain = false;

        this.url = val.url;
      }
    });
  }

  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }
}
