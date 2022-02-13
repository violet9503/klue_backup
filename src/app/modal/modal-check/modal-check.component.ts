import { Component } from '@angular/core';

import {UserService} from '../../user.service';
import {SharedService} from '../../shared-service';
import {RoutingService} from '../../routing.service';

@Component({
  selector: 'modal-check',
  templateUrl: './modal-check.component.html',
  styleUrls: ['./modal-check.component.css']
})
export class ModalCheckComponent{
  pwConditionWrong:string;
  isWrong_pw:boolean = false;

  constructor(private userService: UserService, private sharedService: SharedService, private routingService: RoutingService){}

  clickSubmit(pw: string){
    this.userService.checkPw(pw).subscribe(data=> {
      console.log(data);
      if(data.code == 40313){
        this.pwConditionWrong = "* 입력하신 비밀번호가 일치하지 않습니다.";
        this.isWrong_pw = true;
      }else if(data.code == 200){
        this.sharedService.stateChange('close');
        this.sharedService.accountCheck = true;
        this.routingService.routing('mypage', 'account');
      }else{
        alert('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
        this.routingService.routing('/');
      }
    });
  }
}
