import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../user.service';
import { Router }  from '@angular/router';
import { SharedService} from '../../shared-service';
import {ModalFooterComponent} from '../modal-footer/modal-footer.component';

@Component({
  selector: 'modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent {
  notAgree:boolean = false;
  loginConditionWrong:string;

  @Output() snsClick = new EventEmitter<boolean>();

  constructor(private userService: UserService, private sharedService: SharedService, private router: Router){ }
  login(id:string, password:string){
    if(id == '' && password == ''){
      this.userService.adminLogin().subscribe(data => {
        window.location.reload();
      });
    }else {
      this.userService.userLogin(id, password)
        .subscribe(data => {
            console.log(data);
              if (data.code == 200) {
                window.location.reload();
              } else if (data.code == 40311) {
                this.sharedService.stateChange('confirm');
              } else if (data.code == 40306) {
                this.loginConditionWrong = "* 해당 아이디는 존재하지 않습니다.";
                this.notAgree = true;
              } else if (data.code == 40307){
                this.loginConditionWrong = "* 아이디와 비밀번호가 일치하지 않습니다.";
                this.notAgree = true;
              } else if(data.code == 40314){
                this.sharedService.oldUserLoginInfo.id = id;
                this.sharedService.oldUserLoginInfo.password = password;
                this.sharedService.oldUserLoginInfo.name = data.data;
                this.sharedService.stateChange('nickname');
              }
            }
        );
    }
  }

  snsCheck(){
    this.snsClick.emit(true);
  }
}
