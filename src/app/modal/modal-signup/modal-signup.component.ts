import {Component, ViewChild, Input, OnChanges} from '@angular/core';
import {UserService} from '../../user.service';
import {UserSignup} from '../../object/user-signup';
import {ModalFooterComponent} from '../modal-footer/modal-footer.component';
import { SharedService} from '../../shared-service';

@Component({
  selector: 'modal-signup',
  templateUrl: './modal-signup.component.html',
  styleUrls: ['./modal-signup.component.css']
})
export class ModalSignupComponent implements OnChanges{
  isNext: boolean = false;
  isWrong_id: boolean = false;
  isWrong_pw: boolean = false;
  isWrong_confirm: boolean = false;
  isWrong_name: boolean = false;
  isWrong_sc: boolean = false;
  isWrong_email: boolean = false;
  schoolEmail: string = "";
  idConditionContent: string = "영문, 숫자 반드시 포함 6자 이상 15자 이하";
  pwConditionContent: string = "영문, 숫자, 특수문자 반드시 포함 8자 이상 15자 이하";
  nameConditionContent: string = "클루에서 사용할 닉네임을 입력해주세요. \n (한 번 설정한 닉네임은 변경하실 수 없습니다.)";
  idConditionWrong: string;
  pwConditionWrong: string;
  pwConfirmWrong: string;
  nameConditionWrong: string;
  emailConditionWrong: string;
  idPattern = /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;
  idPattern2 = /[^a-zA-Z0-9]/;
  pwPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]).*$/;
  pwPattern2 = /[^a-zA-Z0-9!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]/;
  namePattern = /[^a-zA-Z0-9가-힣 _]/;
  user: UserSignup = {id: '', password: '', name: '', sc_id: '', sc_email: ''};
  snsUser = {access_token:'', name: '', sc_id: '', sc_email: ''};
  flag: string;

  @Input() next: boolean;

  @ViewChild(ModalFooterComponent)
  private ModalFooterComponent: ModalFooterComponent;


  constructor(private userService: UserService, private sharedService: SharedService) {};

  ngOnChanges(){
    if(this.next == true){
      this.isNext = true;
    }else{
      this.isNext = false;
    }
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

  idCheck(e: any) {
    this.user.id = e;

    if (this.idPattern.test(e) == false) {
      this.idConditionWrong = "* 영문, 숫자 반드시 포함 6~15자만 가능";
      this.isWrong_id = true;
    } else if (this.idPattern2.test(e) == true) {
      this.idConditionWrong = "* 영문과 숫자만 가능";
      this.isWrong_id = true;
    }
    else {
      this.userService.userIdCheck(e).subscribe(
        data => {
          if (!data.isLogin && !data.id) {
            this.idConditionContent = "* 사용 가능한 아이디입니다.";
            this.isWrong_id = false;
          } else if (data.id) {
            this.idConditionWrong = "* 이미 사용중인 아이디입니다.";
            this.isWrong_id = true;
          }
        })
    }
  }

  pwCheck(e: any) {
    this.user.password = e;

    if (this.pwPattern.test(e) == false) {
      this.pwConditionWrong = "* 영어,숫자,특수문자 반드시 포함 8~15자만 가능";
      this.isWrong_pw = true;
    } else if (this.pwPattern2.test(e) == true) {
      this.pwConditionWrong = "* 올바르지 않은 비밀번호입니다";
      this.isWrong_pw = true;
    }
    else {
      this.pwConditionContent = "* 사용 가능한 비밀번호입니다";
      this.isWrong_pw = false;
    }
  }


  nameCheck(name:string) {
    this.user.name = name;
    if (this.namePattern.test(name) == true || name.length < 2 || name.length > 12) {
      this.nameConditionWrong = "* 닉네임은 영어or한글or숫자 2~12자";
      this.isWrong_name = true;
    }
    else {
      this.userService.nameCheck(name).subscribe(data => {
        if (!data.isLogin && !data.name) {
          this.nameConditionContent = "* 사용 가능한 닉네임입니다.";
          this.isWrong_name = false;
        } else if (data.name) {
          this.nameConditionWrong = "* 이미 사용중인 닉네임입니다.";
          this.isWrong_name = true;
        }
      });
    }
  }

  firstCheck(pwConfirm: string) {
    if (this.user.id.length == 0 || this.isWrong_id) {
      this.idConditionWrong = "* 영문, 숫자 반드시 포함 6~15자만 가능";
      this.isWrong_id = true;
    } else if (this.user.password.length == 0 || this.isWrong_pw) {
      this.pwConditionWrong = "* 영어,숫자,특수문자 반드시 포함 8~15자만 가능";
      this.isWrong_pw = true;
    } else if (pwConfirm == this.user.password) {
      this.isNext = true;
    } else {
      this.isWrong_confirm = true;
    }
  }

  snsCheck(){
    this.isNext = true;
    this.flag = this.ModalFooterComponent.flag;
    this.snsUser.access_token = this.ModalFooterComponent.access_token;
  }

  secondCheck(sc_id: string, sc_email: string) {
    if (sc_id.length == 0) {
      this.isWrong_sc = true;
    } else if (this.user.name.length == 0 || this.isWrong_name) {
      this.nameConditionWrong = "* 닉네임은 영어or한글or숫자 2~12자";
      this.isWrong_name = true;
    } else {
      this.user.sc_id = sc_id;
      this.user.sc_email = sc_email.split('@')[0];
      this.userService.emailCheck(this.user.sc_id, this.user.sc_email).subscribe(data => {
        console.log(data);
        if (data.recent_unregistered_email) {
          this.emailConditionWrong = "* 탈퇴 후 한달이 지나지 않은 이메일입니다.";
          this.isWrong_email = true;
        } else if (data.sc_email) {
          this.emailConditionWrong = "* 이미 사용중인 이메일입니다.";
          this.isWrong_email = true;
        } else if (!data.isLogin && !data.sc_email) {
          if(this.flag == null){
            this.userService.signUp(this.user).subscribe(data => {
              console.log(data.code);
              if (data.code == 200) {
                this.sharedService.stateChange('complete');
              } else {
                console.log('sign up error' + data.code);
              }
            });
          } else{
            this.snsUser.sc_id = sc_id;
            this.snsUser.sc_email = sc_email.split('@')[0];
            this.snsUser.name = this.user.name;
            this.userService.signUpSNS(this.snsUser, this.flag).subscribe(data => {
              console.log(data.code);
              if (data.code == 200) {
                this.sharedService.stateChange('complete');
              } else {
                console.log('SNS sign up error' + data.code);
              }
            });
          }
        }
      })
    }
  }
}
