import {Component, ViewChild, ElementRef} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {MypageService} from '../mypage.service';

@Component({
  selector: 'mypage-password',
  templateUrl: './mypage-password.component.html',
  styleUrls: ['./mypage-password.component.css']
})
export class MypagePasswordComponent{
  isLogin:boolean = true;
  isWrong_oldPw:boolean = false;
  isWrong_newPw:boolean = false;
  oldPw:string="";
  pwPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]).*$/;
  pwPattern2 = /[^a-zA-Z0-9!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]/;
  pwWrongContent: string = "";
  constructor(private route:ActivatedRoute, private mypageService: MypageService, private router: Router){}

  changePw(pw:string, pwcheck:string){
    this.isWrong_oldPw = false;
    this.isWrong_newPw = false;
    if (this.pwPattern.test(pw) == false) {
      this.pwWrongContent = "* 영어, 숫자, 특수문자 반드시 포함 8~15자만 가능";
      this.isWrong_newPw = true;
    } else if (this.pwPattern2.test(pw) == true) {
      this.pwWrongContent = "* 올바르지 않은 비밀번호입니다";
      this.isWrong_newPw = true;
    } else if(pw != pwcheck){
      this.pwWrongContent = "* 두 비밀번호가 일치하지 않습니다.";
      this.isWrong_newPw = true;
    } else if(this.oldPw.length == 0){
      this.pwWrongContent = "* 현재 비밀번호를 입력해주세요.";
      this.isWrong_oldPw = true;
    } else if(this.oldPw == pw){
      this.pwWrongContent = "* 바꾸려는 비밀번호가 현재 비밀번호와 일치합니다.";
      this.isWrong_newPw = true;
    } else {
      this.mypageService.updatePw(this.oldPw, pw).subscribe(data =>{
        console.log(data);
        if(data.code == 200){
          alert('비밀번호 변경에 성공했습니다.');
          this.router.navigate(['/mypage/account']);
        }else if(data.code == 40313){
          this.pwWrongContent = "* 현재 비밀번호가 일치하지 않습니다.";
          this.isWrong_oldPw = true;
        }else{
          alert('오류가 발생했습니다. 잠시 뒤에 다시 시도해주세요.');
          //this.router.navigate(['/mypage/account']);
        }
      })
    }
  }
}
