import {Component, Input, OnChanges} from '@angular/core';
import {RoutingService} from '../../routing.service';
import {MypageService} from '../mypage.service';

@Component({
  selector: 'mypage-header',
  templateUrl: './mypage-header.component.html',
  styleUrls: ['./mypage-header.component.css']
})

export class MypageHeaderComponent implements OnChanges{
  @Input() url: string;
  isMain:boolean;
  isTable:boolean;
  isCoffee:boolean;
  isHistory:boolean;

  constructor(private routingService: RoutingService, private mypageService: MypageService) {}

  ngOnChanges(){
    this.isMain = false;
    this.isTable = false;
    this.isCoffee = false;
    this.isHistory = false;

    if(this.url == '/mypage/coffeebean' || this.url == '/mypage/coffeecup'){
      this.isCoffee = true;
    }else if(this.url.indexOf("timetable") != -1){
      this.isTable = true;
    }else if(this.url.indexOf("history") != -1){
      this.isHistory = true;
    }else{
      this.isMain = true;
    }
  }

  gotoTimetable(){
    this.mypageService.getTables().subscribe(data =>{
      console.log(data);
      if(data.code == 200){
        if(data.data.length != 0)
          this.routingService.routing('mypage/timetable', data.data[0].id.toString());
        else
          this.routingService.routing('mypage/timetable', '0');

      }else{
        console.log(data);
      }
    })
  }
}
