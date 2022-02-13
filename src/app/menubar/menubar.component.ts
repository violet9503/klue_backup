import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import {UserService} from '../user.service';
import {SharedService} from '../shared-service';

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit, OnDestroy {
  isUser = false;
  isGuest = false;
  isSearch = false;
  isLecture = false;
  isNote = false;
  savedObservable:any[] = [];

  constructor(private router: Router, private userService: UserService, private sharedService: SharedService) {
    this.savedObservable.push(sharedService.changeLogin$.subscribe(
      state => {
        this.change(state);
      }));

    this.savedObservable.push(router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(val.url.indexOf('/lecture') != -1){
          this.isLecture = true;
          this.isNote = false;
        }
        else if(val.url.indexOf('/note') != -1) {
          this.isLecture = false;
          this.isNote = true;
        }
        else{
          this.isLecture = false;
          this.isNote = false;
        }
      }
    }));
  }

  ngOnInit() {
    if (this.userService.userInfo) {
      this.isUser = true;
      this.isGuest = false;
    } else {
      this.isGuest = true;
      this.isUser = false;
    }
  }

  ngOnDestroy(){
    this.savedObservable.forEach(Subject => Subject.unsubscribe());
  }

  change(state: boolean) {
    if (state) {
      this.isUser = true;
      this.isGuest = false;
    } else {
      this.isGuest = true;
      this.isUser = false;
    }
  }

  clickSearch(state: boolean) {
    if (state == true) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
  }
}
