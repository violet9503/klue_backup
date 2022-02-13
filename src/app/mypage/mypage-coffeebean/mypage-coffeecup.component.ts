import {Component} from '@angular/core';
@Component({
  selector: 'mypage-coffeecup',
  templateUrl: './mypage-coffeecup.component.html',
  styleUrls: ['./mypage-coffeecup.component.css']
})
export class MypageCoffeecupComponent{
  term: number;

  changeTerm(value:number){
    if(value == this.term)
      this.term = null;
    else
      this.term = value;
  }
}
