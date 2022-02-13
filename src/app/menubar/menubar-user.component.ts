import { Component, OnInit, OnDestroy, Inject, Renderer} from '@angular/core';
import { Router, NavigationEnd }  from '@angular/router';
import { UserService } from '../user.service';
import { RoutingService} from '../routing.service';
import {MypageService} from '../mypage/mypage.service';
import {SharedService} from '../shared-service';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
  selector: 'menubar-user',
  templateUrl: './menubar-user.component.html',
  styleUrls: ['./menubar-user.component.css'],
  providers: [MypageService]
})

export class MenubarUserComponent implements OnInit, OnDestroy{

  private isClick_profile = false;
  private isClick_alert = false;
  private isFocus_profile = false;
  private isFocus_alert = false;
  private isNewNotice:boolean = false;
  private clickListener : any;
  private alarmList: any[];
  profile_name:string;
  savedObservable:any;

  constructor(private userService: UserService,
              private router: Router,
              private routingService: RoutingService,
              private mypageService: MypageService,
              private sharedService: SharedService,
              private renderer: Renderer,
              @Inject(DOCUMENT) private document: Document){
    this.savedObservable = router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.isClick_profile = false;
        this.isClick_alert = false;

        this.userService.getAlarmStatus().subscribe(data =>{
          if(data.code == 200)
            this.isNewNotice = false;
          else if(data.code == 201)
            this.isNewNotice = true;
          else
            console.log('getAlarm Error'+data);
        })
      }
    })
  }

  ngOnInit(){
    this.userService.getAlarmStatus().subscribe(data =>{
      if(data.code == 200)
        this.isNewNotice = false;
      else if(data.code == 201)
        this.isNewNotice = true;
      else
        console.log('getAlarm Error'+data);
    })
  }

  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }

  alert_click(){
    if(this.isClick_profile){
      this.profile_click();
      this.clickListener();
    }

    this.isClick_alert = !this.isClick_alert;
    if(this.isClick_alert){
      this.isNewNotice = false;
      this.userService.getAlarmList(5).subscribe(data =>{
        if(data.code == 200){
          this.alarmList = data.data;
          for(let i=0; i<this.alarmList.length; i++){
            if(this.alarmList[i].profile){
              this.alarmList[i].profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+this.alarmList[i].profile;
            }else{
              this.alarmList[i].profile = "/assets/img/Profile_Default.png";
            }
          }
        }else{
          console.log("getAlarm Error" + data.code);
        }
      })

      this.clickListener = this.renderer.listen(this.document.body, "click", (event)=>{
        let isClickFirst:boolean;
        if(event.target.tagName == "IMG"){
          if(event.target.currentSrc.indexOf("Notification") == -1)
            isClickFirst = false;
          else
            isClickFirst = true;
        }else
          isClickFirst = false;

        if(!this.isFocus_alert && !isClickFirst)
          this.isClick_alert = false;

      });
    }else{
      this.clickListener();
    }
  }

  profile_click(){
    if(this.isClick_alert){
      this.alert_click();
      this.clickListener();
    }

    this.isClick_profile = !this.isClick_profile;
    if(this.isClick_profile){
      this.clickListener = this.renderer.listen(this.document.body, "click", (event)=>{
        let isClickFirst:boolean;
        if(event.target.tagName == "IMG"){
          if(event.target.currentSrc.indexOf("profile") == -1 && event.target.currentSrc.indexOf("Default") == -1)
            isClickFirst = false;
          else
            isClickFirst = true;
        }else
          isClickFirst = false;

        if(!this.isFocus_profile && !isClickFirst)
          this.isClick_profile = false;
      });
    }else{
      this.clickListener();
    }
  }

  tooltipFocus(element:string, state:boolean){
    if(element == "alert"){
      this.isFocus_alert = state;
    }else{
      this.isFocus_profile = state;
    }
  }

  logout(){
    this.userService.logout()
      .subscribe(data => {
        console.log(data);
        if (data.code == 200) {
          alert('로그아웃 되셨습니다.');
          this.sharedService.loginChange(false);
          this.userService.userInfo = null;
          this.router.navigate(['/']);
        } else {
          alert('잘못된 접근입니다.');
        }
      })
  }

  unregister(){
      this.userService.unRegister().subscribe(data=>{
          if (data.code == 200) {
            this.userService.userInfo = null;
              if(this.router.url == '/'){
                  window.location.reload();
              }else{
                  this.router.navigate(['/']);
              }
          } else {
              alert('잘못된 접근입니다.');
          }
      });
  }

  gotoTimetable(){
    this.mypageService.getTables().subscribe(data =>{
      console.log(data);
      if(data.code == 200){
        if(data.data.length != 0)
          this.routingService.routing('mypage/timetable', data.data[0].id.toString());
        else
          this.routingService.routing('mypage/timetable', '0');

      }else{
        console.log(data);
      }
    })
  }
}
