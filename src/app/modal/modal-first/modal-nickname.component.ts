import { Component, OnInit } from '@angular/core';

import {UserService} from '../../user.service';
import {SharedService} from '../../shared-service';
import {RoutingService} from '../../routing.service';

@Component({
  selector: 'modal-nickname',
  templateUrl: './modal-nickname.component.html',
  styleUrls: ['./modal-nickname.component.css']
})
export class ModalNicknameComponent implements OnInit{
  namePattern = /[^a-zA-Z0-9가-힣 _]/;
  userName:string="";
  nameConditionWrong:string;
  nameConditionContent: string = "한글 2~8자, 영어 4~16자";
  isWrong_name:boolean = false;

  constructor(private userService: UserService, private sharedService: SharedService, private routingService: RoutingService){}

  ngOnInit(){
    this.userName = this.sharedService.oldUserLoginInfo.name;
    this.nameCheck(this.userName);
  }

  nameCheck(name:string) {
    this.userName = name;
    if (this.namePattern.test(name) == true || name.length < 2 || name.length > 12) {
      this.nameConditionWrong = "*닉네임은 영어or한글or숫자 2~12자";
      this.isWrong_name = true;
    }
    else {
      this.userService.nameCheck(name, this.sharedService.oldUserLoginInfo.id).subscribe(data => {
        if (!data.isLogin && !data.name) {
          this.nameConditionContent = "*사용 가능한 닉네임입니다.";
          this.isWrong_name = false;
        } else if (data.name) {
          this.nameConditionWrong = "*이미 사용중인 닉네임입니다.";
          this.isWrong_name = true;
        }
      });
    }
  }

  clickSubmit(){
    if(this.isWrong_name){
      alert('닉네임을 다시 한번 확인해주세요.');
    }else{
      if(!this.sharedService.oldUserLoginInfo.id || !this.sharedService.oldUserLoginInfo.id){
        alert('잘못된 접근입니다.');
        window.location.reload();
      }else{
        this.userService.userLogin(this.sharedService.oldUserLoginInfo.id, this.sharedService.oldUserLoginInfo.password, this.userName)
          .subscribe(data => {
              if (data.code == 200) {
                this.userService.isLogin().subscribe(data => {
                  if(data.code == 200){
                    this.userService.userInfo = data.data;
                    this.sharedService.loginChange(true);
                    this.sharedService.stateChange('auth');
                  }
                });
              } else {
                alert('오류가 발생하였습니다.');
                console.log(data);
                window.location.reload();
              }
            }
          );
      }
    }
  }
}
