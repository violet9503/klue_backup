import {Component, OnInit} from '@angular/core';
import {RoutingService} from '../../routing.service';
import {UserService} from '../../user.service';

@Component({
  selector: 'footer-privacy',
  template: `<div class="footer-content-wrap" [innerHTML]="contents"></div>`,
  styleUrls: ['./footer-privacy.component.css']
})

export class FooterPrivacyComponent implements OnInit{
  contents:any;

  constructor(private routingService: RoutingService, private userService: UserService) {}

  ngOnInit(){
    this.userService.loadClause("privacy").subscribe(data => {
      this.contents = data.text();
    })
  }
}
