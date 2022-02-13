import {Component, Input, OnChanges} from '@angular/core';
import {RoutingService} from '../../routing.service';

@Component({
  selector: 'footer-header',
  templateUrl: './footer-header.component.html',
  styleUrls: ['./footer-header.component.css']
})

export class FooterHeaderComponent implements OnChanges{
  @Input() url: string;
  isPrivacy:boolean;
  isService:boolean;
  isPay:boolean;

  constructor(private routingService: RoutingService) {}

  ngOnChanges(){
    this.isPrivacy = false;
    this.isService = false;
    this.isPay = false;

    if(this.url == '/policy/privacy'){
      this.isPrivacy = true;
    }else if(this.url == '/policy/service'){
      this.isService = true;
    }else if(this.url == '/policy/pay'){
      this.isPay = true;
    }
  }
}
