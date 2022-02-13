import {Component, OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'footer-view',
  template: `
    <div class="footer-wrap">
        <footer-header [url]="url"></footer-header>
        <router-outlet></router-outlet>
        <div class="klue-logo"><img src="/assets/img/KLUE_Logo_grey.png"/></div>
    </div>
  `,
  styleUrls: ['./footer-view.component.css']
})
export class FooterViewComponent implements OnDestroy{
  url:string;
  savedObservable:any;

  constructor( private router: Router ) {
    this.savedObservable = router.events.subscribe((val) => {
      if(val instanceof NavigationEnd)
        this.url = val.url;
    });
  }

  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }
}
