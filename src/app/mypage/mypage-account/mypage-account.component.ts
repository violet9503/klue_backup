import { Component, Output, EventEmitter } from '@angular/core';
import {UserService} from '../../user.service';
import {MypageService} from '../mypage.service';
import { SharedService } from '../../shared-service';
import { RoutingService } from '../../routing.service';

declare var gapi: any;
declare var FB: any;

@Component({
  selector: 'mypage-account',
  templateUrl: './mypage-account.component.html',
  styleUrls: ['./mypage-account.component.css']
})
export class MypageAccountComponent{
  access_token:string;
  flag: string;

  @Output() snsClick = new EventEmitter<boolean>();

  constructor(private userService: UserService, private sharedService:SharedService, private mypageService: MypageService, private routingService: RoutingService){

    console.log('Initializing Facebook');

    FB.init({
      appId: '252101671957972',
      xfbml: true,
      version: 'v2.9'
    });
  }

  goFacebook() { //페이스북버튼 터치시 호출됨
    let that = this;
    FB.getLoginStatus(function(res) {
      console.log(res);
      if (res.status === 'connected') {
        that.connectSNS("facebook", res.authResponse.accessToken);
      }
      else {
        FB.login(function(response){
          if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            that.connectSNS("facebook", response.authResponse.accessToken);
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {scope: 'email, public_profile, user_friends'});
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
        that.connectSNS("google", auth2.currentUser.get().getAuthResponse(true).access_token);
      }else{
        auth2.signIn().then(function() {
          that.connectSNS("google", auth2.currentUser.get().getAuthResponse(true).access_token);
        });
      }
    });
  }


  connectSNS(flag, token){
    this.mypageService.connectSNS(flag, token).subscribe(data => {
      console.log(data);
      if(data.code == 200){
        alert('SNS 계정 연동에 성공했습니다.');
        this.mypageService.getInfo().subscribe(data => {
          if(data.code == 200)
            this.mypageService.userInfo = data.data;
          else
            this.routingService.routing('/');
        })
      }else{
        alert('SNS 계정 연동에 실패했습니다. 잠시 후에 다시 시도해주세요.');
      }
    })
  }
}
