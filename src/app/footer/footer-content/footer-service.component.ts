import {Component, OnInit} from '@angular/core';
import {RoutingService} from '../../routing.service';
import {UserService} from '../../user.service';

@Component({
  selector: 'footer-service',
  template: `<div class="footer-content-wrap" [innerHTML]="contents"></div>`,
  styleUrls: ['./footer-service.component.css']
})

export class FooterServiceComponent implements OnInit{
  contents:any;

  constructor(private routingService: RoutingService, private userService: UserService) {}

  ngOnInit(){
    this.userService.loadClause().subscribe(data => {
      this.contents = data.text();
    })
  }
}
