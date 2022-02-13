import { Component, ViewChild, ElementRef, Renderer, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router }  from '@angular/router';
import { UserService } from '../user.service';
import { SharedService } from '../shared-service';
import {trigger, state, style, animate, transition} from '@angular/animations';

declare var $:any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../assets/css/carousel.css']
})

export class IndexComponent implements OnInit, OnDestroy, AfterViewInit{
  private isUser : boolean = false;
  private isGuest : boolean = false;
  private isEval : boolean = true;
  private isNote : boolean = false;
  private carouselImg : any[];
  private savedObservable: any;

  @ViewChild('carouselList') carouselEl: ElementRef;


  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router,
    private renderer: Renderer){

    this.savedObservable = sharedService.changeLogin$.subscribe(
      state => {
        this.change(state);
      });
  }

  ngOnInit(){
    if(this.userService.userInfo) {
      this.isUser = true;
      this.isGuest = false;
    }else{
      this.isGuest = true;
      this.isUser = false;
    }

    this.userService.getIndexImg().subscribe(data => {
      this.carouselImg = data;
    })
  }

  ngAfterViewInit(){
    this.changeIndexImg();
  }


  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }

  change(state:boolean){
    if(state){
      this.isUser = true;
      this.isGuest = false;
    }else{
      this.isGuest = true;
      this.isUser = false;
    }
  }


  onSearch(keyword:string){
    if(keyword.length == 0){
      alert('검색어를 입력해주세요');
    }else{
      if(this.isEval){
        this.router.navigate(['lecture/search/', keyword]);
      }else if(this.isNote){
        this.router.navigate(['note/main', keyword]);
      }else{
        alert('검색 오류');
      }

    }
  }

  changeFocus(state:string){
    if(state == "eval"){
      this.isEval = true;
      this.isNote = false;
    }else if(state == "note"){
      this.isEval = false;
      this.isNote = true;
    }
  }

  changeIndexImg(){
    $('.carousel').carousel('cycle', {
      interval: 3000
    })
  }

  clickCarousel(url:string){
    let openTap:any;
    if(url)
       openTap = window.open(url);
  }
}
