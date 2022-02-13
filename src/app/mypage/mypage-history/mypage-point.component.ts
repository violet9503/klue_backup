import { Component, OnInit} from '@angular/core';

import {MypageService} from '../mypage.service';

@Component({
  selector: 'mypage-point',
  templateUrl: './mypage-point.component.html',
  styleUrls: ['./mypage-point.component.css']
})
export class MypagePointComponent implements OnInit{
  pointList:any[];
  pageList:number[] = [];
  currentPage:number;
  maxPage:number;
  existNext:boolean = false;

  constructor(private mypageService: MypageService){}

  ngOnInit(){
    this.mypageService.getMyPoint().subscribe(data => {
      console.log(data);
      if(data.code == 200){
        this.maxPage = ((data.total_count-1)/10)+1;
        this.existNext = this.maxPage>5 ? true : false;
        this.pointList = data.data;
        this.currentPage = 1;

        for(let i=1; i<=this.maxPage && i<=5; i++)
          this.pageList.push(i);

        for(let i=0; i<this.pointList.length; i++){
          this.pointList[i].created_at = this.pointList[i].created_at.split(' ')[0].replace(/-/gi, '.');
        }

      }else{
        console.log('Get Point Error'+data.code);
      }
    })
  }

  clickPage(num: number){
    if(this.currentPage == num)
      return;

    this.currentPage = num;
    this.mypageService.getMyPoint(num).subscribe(data=>{
      console.log(data);

      if(data.code == 200) {
        this.pointList = data.data;

        for(let i=0; i<this.pointList.length; i++){
          this.pointList[i].created_at = this.pointList[i].created_at.split(' ')[0].replace(/-/gi, '.');
        }

      }else{
        console.log('Get Point Error'+data.code);
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
