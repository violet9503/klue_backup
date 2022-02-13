import {Component} from '@angular/core';
import {SharedService} from '../../shared-service';

@Component({
  selector: 'mypage-coffeebean',
  templateUrl: './mypage-coffeebean.component.html',
  styleUrls: ['./mypage-coffeebean.component.css']
})
export class MypageCoffeebeanComponent{
  isBuy:boolean = true;
  term: number;

  constructor (private sharedService:SharedService){}

  changeTap(state:boolean){
    this.isBuy = state;
  }

  changeTerm(value:number){
    if(value == this.term)
      this.term = null;
    else
      this.term = value;
  }

  clickCharge(){
    this.sharedService.stateChange('charge');
  }
}
