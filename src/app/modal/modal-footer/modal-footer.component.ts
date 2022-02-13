import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../user.service';
import { SharedService } from '../../shared-service';

declare var gapi: any;
declare var FB: any;

@Component({
  selector: 'modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.css']
})
export class ModalFooterComponent implements OnChanges{
  @Input() state: string;
  isShow:boolean = false;
  access_token:string;
  flag: string;

  @Output() snsClick = new EventEmitter<boolean>();

  constructor(private userService: UserService, private sharedService:SharedService){

    console.log('Initializing Facebook');

    FB.init({
      appId: '252101671957972',
      xfbml: true,
      version: 'v2.9'
    });
  }

  ngOnChanges(){
    if(this.state == "signup"){
      this.isShow = true;
    }else{
      this.isShow = false;
    }
  }

  goFacebook() { //페이스북버튼 터치시 호출됨
    let that = this;
    FB.getLoginStatus(function(res) {
      console.log(res);
      if (res.status === 'connected') {
        console.log(res);
        that.getFacebook(res.authResponse.accessToken);
      }
      else {
        FB.login(function(response){
          if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            that.getFacebook(response.authResponse.accessToken);
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {scope: 'email, public_profile, user_friends'});
      }
    });
  }

  getFacebook(token) { //페이스북 토큰 가져와 로그인 혹은 회원가입 시도
    this.userService.getFacebookToken(token).subscribe(data=>{

      console.log(data);
      if (data.code == 40301) {
        console.log("이미 로그인 되어있음");
      }
      else if (data.code == 40306) {
        console.log("아직 가입되지 않은 토큰");
        this.access_token = token;
        this.flag = "facebook";
        this.snsClick.emit(true);
      }else if(data.code == 200){
        window.location.reload();
      }
      else {
        console.log("로그인 실패 : "+ data.code);
      }
    });
  }

  goGoogle(){
    let that = this;
    gapi.load('auth2', function() {
      let auth2 = gapi.auth2.init({
        client_id: '57746069493-pjd67uqp2fr935lgof8bufllndjlot5g.apps.googleusercontent.com'
      });
      if (auth2.isSignedIn.get()) {
        that.getGoogle(auth2.currentUser.get().getAuthResponse(true).access_token);
      }else{
        auth2.signIn().then(function() {
          that.getGoogle(auth2.currentUser.get().getAuthResponse(true).access_token);
        });
      }
    });
  }

  getGoogle(token){
    this.userService.getGoogleToken(token).subscribe(data=>{

      console.log(data);
      if (data.code == 40301) {
        console.log("이미 로그인 되어있음");
      }
      else if (data.code == 40306) {
        console.log("아직 가입되지 않은 토큰");
        this.access_token = token;
        this.flag = "google";
        this.snsClick.emit(true);
      }else if(data.code == 200){
        window.location.reload();
      }
      else {
        console.log("로그인 실패 : "+ data.code);
      }
    });
  }

}
