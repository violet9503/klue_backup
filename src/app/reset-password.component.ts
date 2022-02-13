import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from './user.service';

@Component({
  selector: 'reset-password',
  templateUrl: './mypage/mypage-password/mypage-password.component.html',
  styleUrls: ['./mypage/mypage-password/mypage-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  isLogin:boolean = false;
  isWrong_pw:boolean = false;
  pwPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]).*$/;
  pwPattern2 = /[^a-zA-Z0-9!@#\$%\^&\*\(\)\\\|\[\]\{\};:\'\",\.<>\/\?`~\-_\+=]/;
  pwWrongContent: string = "";
  @ViewChild('pwContainer') el: ElementRef;
  constructor(private route:ActivatedRoute, private userService: UserService, private router: Router){}

  ngOnInit(){
    this.el.nativeElement.style.marginTop = '100px';
  }

  changePw(pw:string, pwcheck:string){
    if (this.pwPattern.test(pw) == false) {
      this.pwWrongContent = "* 영어, 숫자, 특수문자 반드시 포함 8~15자만 가능";
      this.isWrong_pw = true;
    } else if (this.pwPattern2.test(pw) == true) {
      this.pwWrongContent = "* 올바르지 않은 비밀번호입니다";
      this.isWrong_pw = true;
    } else if(pw != pwcheck){
      this.pwWrongContent = "* 두 비밀번호가 일치하지 않습니다.";
      this.isWrong_pw = true;
    }
    else {
      this.userService.resetPw(this.route.snapshot.paramMap.get('token'), pw).subscribe(data =>{
        if(data.code == 200){
          alert('비밀번호 변경에 성공했습니다.');
          this.router.navigate(['/']);
        }else if(data.code == 40712){
          alert('올바른 접근이 아닙니다.');
          this.router.navigate(['/']);
        }else if(data.code == 40713) {
          alert('유효시간이 지났습니다. 다시 메일을 받아 시도해주세요.');
        }else{
          alert('오류가 발생했습니다. 잠시 뒤에 다시 시도해주세요.');
        }
        this.router.navigate(['/']);
      })
    }
  }
}
