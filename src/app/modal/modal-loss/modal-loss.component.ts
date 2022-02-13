import { Component } from '@angular/core';

import {UserService} from '../../user.service';
import {SharedService} from '../../shared-service';

@Component({
  selector: 'modal-loss',
  templateUrl: './modal-loss.component.html',
  styleUrls: ['./modal-loss.component.css']
})
export class ModalLossComponent {
  private isId:boolean = true;
  private findComplete:boolean = false;
  private schoolEmail:string = "";
  private userId:string = "";
  private findInputWrong:string;
  private findSelectWrong:string;

  constructor(private userService: UserService, private sharedService: SharedService){}

  changeTap(state: boolean) {
    this.isId = state;
  }

  sc_idChange(event){
    let sc_id = event.target.value;
    if(sc_id == "ku")
      this.schoolEmail = "@korea.ac.kr";
    else if(sc_id == "ku_sejong")
      this.schoolEmail = "@korea.ac.kr";
    else
      this.schoolEmail = "";
  }

  clickFindId(sc_id:string, sc_email:string){
    this.findInputWrong = "";
    this.findSelectWrong = "";
    if(sc_id == ""){
      this.findSelectWrong = "* 소속 학교를 선택해주세요.";
      return;
    }else if(sc_email == ""){
      this.findInputWrong = "* 이메일을 입력해주세요.";
      return
    }
    this.userService.findId(sc_id, sc_email).subscribe(data =>{
      if(data.code == 200){
        this.userId = data.data;
        this.findComplete = true;
      }else if(data.code == 40312){
        this.findInputWrong = "* 해당 이메일 주소와 일치하는 아이디가 없습니다.";
      }
    })
  }

  clickFindPw(id:string){
    this.findInputWrong = "";

    if(id == ""){
      this.findInputWrong = "* 아이디를 입력해주세요.";
      return;
    }

    this.userService.findPw(id).subscribe(data =>{
      if(data.code == 200)
        this.findComplete = true;
      else if(data.code == 40702)
        this.findInputWrong = "* 입력하신 아이디는 존재하지 않습니다.";
      else if(data.code == 40703)
        this.findInputWrong = "* 입력하신 아이디는 인증되지 않은 아이디입니다.";
      else
        this.findInputWrong = "* 유효하지 않은 아이디입니다.";
    })
  }
}
