import { Component, OnInit } from '@angular/core';

import { UserService} from '../user.service';
import { SharedService} from '../shared-service';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit{
  constructor(private userService:UserService, private sharedService: SharedService) {};

  ngOnInit(){
    this.userService.isLogin().subscribe(data => {
      if(data.code == 200){
        this.userService.userInfo = data.data;
        if(data.data.profile){
          this.userService.userInfo.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/large/"+data.data.profile;
        }else
          this.userService.userInfo.profile = "/assets/img/Profile_Default.png";
      }
    });
  }

  clickGetEval(){
    let getConfirm = confirm("100 포인트로 열람 권한을 얻으시겠습니까?");

    if(getConfirm){
      this.userService.getReadAuth().subscribe(data =>{
        console.log(data);
        if(data.code == 200){
          alert('열람 권한을 얻으셨습니다.');
          window.location.reload();
        }else{
          console.log(data);
        }
      })
    }
  }
}
