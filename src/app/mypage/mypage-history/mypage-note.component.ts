import { Component, OnInit} from '@angular/core';

import {MypageService} from '../mypage.service';

@Component({
  selector: 'mypage-note',
  templateUrl: './mypage-note.component.html',
  styleUrls: ['./mypage-note.component.css']
})
export class MypageNoteComponent implements OnInit{
  uploadNote:any[];
  downNote:any[];
  pageList:any[] = [[], []];
  currentPage:number[] = [1, 1];
  maxPage:number[] = [0, 0];
  existNext:boolean[] = [false,false];

  constructor(private mypageService: MypageService){}

  ngOnInit(){
    this.mypageService.getUploadNote().subscribe(data=>{
      console.log(data);

      if(data.code == 200){
        //this.maxPage = ((data.total_count-1)/10)+1;
        //this.existNext = this.maxPage>5 ? true : false;
        this.uploadNote = data.data;

        // for(let i=1; i<=this.maxPage && i<=5; i++)
        //   this.pageList.push(i);

        for(let i=0; i<this.uploadNote.length; i++){
          this.uploadNote[i].created_at = this.uploadNote[i].created_at.split(' ')[0].replace(/-/gi, '.');
        }

      }else{
        console.log('Get uploadNote Error'+data.code);
      }
    })


    this.mypageService.getDownNote().subscribe(data=>{
      console.log(data);

      if(data.code == 200){
        this.maxPage[1] = ((data.total_count-1)/10)+1;
//        this.existNext[1] = this.maxPage>5 ? true : false;
        this.downNote = data.data;

         for(let i=1; i<=this.maxPage[1] && i<=5; i++)
           this.pageList[1].push(i);

        for(let i=0; i<this.downNote.length; i++){
          this.downNote[i].created_at = this.downNote[i].created_at.split(' ')[0].replace(/-/gi, '.');
        }
      }else{
        console.log('Get downNote Error'+data.code);
      }
    })
  }

  clickPage(num: number){
    /*
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
    */
  }

  setPageList(state:boolean){
    /*
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
    */
  }
}
