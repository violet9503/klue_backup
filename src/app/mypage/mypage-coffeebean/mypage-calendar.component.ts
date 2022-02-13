import {Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'mypage-calendar',
  templateUrl: './mypage-calendar.component.html',
  styleUrls: ['./mypage-calendar.component.css']
})
export class MypageCalendarComponent implements OnInit, OnChanges{
  @Input() term: number;
  year: number[] = [2016, 2017];
  month: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  preDay: number[];
  laterDay: number[];
  originalDay: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  preDate = new Date();
  laterDate = new Date();


  ngOnInit(){
    this.setDay();
  }

  ngOnChanges(){
    if(this.term){
      this.laterDate = new Date();
      this.preDate = new Date();
      if(this.term == 7)
        this.preDate.setDate(this.preDate.getDate() - 7);
      else
        this.preDate.setMonth(this.preDate.getMonth() - this.term);
    }
  }


  getDay(year: number, month: number) {
    if (month == 2) {
      if ((( year % 4 == 0 && year % 100 != 0 ) || year % 400 == 0))
        return this.originalDay.slice(0, -2);
      else
        return this.originalDay.slice(0, -3);
    }
    else {
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        return this.originalDay;
      else
        return this.originalDay.slice(0, -1);
    }
  }

  changeDate(date, state:string, value:number){
    if(state == "Year")
      date.setFullYear(value);
    else if(state == "Month"){
      let lastDay = (new Date(date.getFullYear(), value, 0)).getDate();
      if(lastDay < date.getDate())
        date.setMonth(value-1, lastDay);
      else
        date.setMonth(value-1);
    }
    else
      date.setDate(value);

    this.setDay();
  }

  setDay(){
    this.preDay = this.getDay(this.preDate.getFullYear(), this.preDate.getMonth()+1);
    this.laterDay = this.getDay(this.laterDate.getFullYear(), this.laterDate.getMonth()+1);
  }
}
