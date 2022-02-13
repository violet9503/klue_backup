import { Component, OnInit} from '@angular/core';

import {UserService} from '../user.service';

@Component({
  selector: 'alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit{
  alarmList:any[];
  pageList:number[] = [];
  currentPage:number;
  maxPage:number;
  existNext:boolean = false;

  constructor(private userService: UserService){}

  ngOnInit(){
    this.userService.getAlarmList(10).subscribe(data=>{
      console.log(data);

      if(data.code == 200){
        this.maxPage = ((data.total_count-1)/10)+1;
        this.existNext = this.maxPage>5 ? true : false;
        this.alarmList = data.data;
        this.currentPage = 1;

        for(let i=1; i<=this.maxPage && i<=5; i++)
          this.pageList.push(i);

        for(let i=0; i<this.alarmList.length; i++){
          if(this.alarmList[i].profile)
            this.alarmList[i].profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/small/"+this.alarmList[i].profile;
          else
            this.alarmList[i].profile = "/assets/img/Profile_Default.png";
        }

      }else{
        console.log('Get Alarm Error'+data.code);
      }
    })
  }

  clickPage(num: number){
    if(this.currentPage == num)
      return;

    this.currentPage = num;
    this.userService.getAlarmList(10, num).subscribe(data=>{
      console.log(data);

      if(data.code == 200) {
        this.alarmList = data.data;

        for(let i=0; i<this.alarmList.length; i++) {
          if (this.alarmList[i].profile)
            this.alarmList[i].profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/small/" + this.alarmList[i].profile;
          else
            this.alarmList[i].profile = "/assets/img/Profile_Default.png";
        }

      }else{
        console.log('Get Alarm Error'+data.code);
      }
    })
  }

  setPageList(state:boolean){
    if(state){
      let lastNum = this.pageList[4];
      this.pageList = [];
      for(let i=lastNum+1; i<=this.maxPage && i<=lastNum+5;i++)
        this.pageList.push(i);

      this.currentPage = this.pageList[0];

      if(this.pageList[4] < this.maxPage)
        this.existNext = true;
      else
        this.existNext = false;
    }else{
      let firstNum = this.pageList[0];
      this.pageList = [];
      for(let i=firstNum-5; i<=this.maxPage && i<=firstNum-1;i++)
        this.pageList.push(i);

      this.currentPage = this.pageList[0];

      this.existNext = true;
    }
  }
}
