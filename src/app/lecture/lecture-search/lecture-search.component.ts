import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Router }  from '@angular/router';
import {SharedService} from '../../shared-service';
import {LectureService} from '../lecture.service';
import {UserService} from '../../user.service';
import { NouisliderComponent } from 'ng2-nouislider';

import 'rxjs/add/operator/switchMap';


const nRage:number = 6;

@Component({
  selector: 'lecture-search',
  templateUrl: './lecture-search.component.html',
  styleUrls: ['./lecture-search.component.css',
              './nouislider.min.css']
})



export class LectureSearchComponent implements OnInit, OnDestroy{

  isOpen:boolean = false;
  searchValue:string = "";
  savedObservable:any[]=[];
  savedFilter:any = {year:"", term:"", category:"", college:"", department:"", sliderOption: [], sliderChange: false};
  savedOptions:any = {year:[], term:["1학기", "2학기", "여름학기", "겨울학기"], category:[], college:[], department:[]};
  saved
  @ViewChildren(NouisliderComponent) sliderChildren: QueryList<NouisliderComponent>;
  searchRange:number[] = [1,5];
  conf:any = {
        start: [1, 5],
        connect: [true, true],
        step:1,
        pips: {
          mode: 'range',
          density: 25
        }
   };


  constructor(private router: Router, private sharedService: SharedService, private lectureService:LectureService, private userService: UserService) {
    this.savedObservable.push( sharedService.changeKeyword$.subscribe(
      state => {
        this.searchValue = state;
      }));

    this.savedObservable.push( sharedService.changeLogin$.subscribe(
      state => {
        if(state)
          this.setYear();
      }));
  }

  ngOnInit(){
    if(this.userService.userInfo)
      this.setYear();
  }

  ngOnDestroy(){
    this.savedObservable.forEach(observable => observable.unsubscribe());
  }

  setYear(){
    this.lectureService.getYear().subscribe(data => {
      if(data.read_lec_eval_year){
        for(let i=data.read_lec_eval_year; i>=2012; i--){
          this.savedOptions.year.push(i);
        }
      }
    })
  }

  isClick(){
    if(this.userService.userInfo)
      this.isOpen = !this.isOpen;
    else
      alert('로그인 후 이용가능합니다.');
  }

  filterChange(state:string, event) {
    let val = event.target.value;
    if(state=="year" || state=="term"){
      if(state == "year")
        this.savedFilter.year = val;
      else
        this.savedFilter.term = val;

      if(val == ""){
        this.savedFilter.category = "";
        this.savedFilter.college = "";
        this.savedFilter.department = "";
        return;
      } else{
        if(this.savedFilter.year != "" && this.savedFilter.term != ""){
          this.lectureService.getCategory(this.savedFilter.year, this.savedFilter.term).subscribe(data =>{
            if(data.code == 200)
              this.savedOptions.category = data.data;
          })
        }
      }
    } else if(state == "category"){
      this.savedFilter.category = val;
      if(val == ""){
        this.savedOptions.college = null;
        this.savedOptions.department = null;
        this.savedFilter.college = "";
        this.savedFilter.department = "";
        return;
      }else{
        this.lectureService.getCategory(this.savedFilter.year, this.savedFilter.term, this.savedFilter.category).subscribe(data =>{
          if(data.code == 200)
            this.savedOptions.college = data.data;
        })
      }
    }else if(state == "college"){
      this.savedFilter.college = val;
      if(val == ""){
        this.savedOptions.department = null;
        this.savedFilter.department = "";
        return;
      }else{
        this.lectureService.getCategory(this.savedFilter.year, this.savedFilter.term, this.savedFilter.category, this.savedFilter.college).subscribe(data =>{
          if(data.code == 200){
            if(data.data[0].department != null)
              this.savedOptions.department = data.data;
            else
              this.savedOptions.department = [{"department":"선택지 없음"}];
          }
        })
      }
    }else if(state == "department"){
      if(val == "" || val == "선택지 없음")
        this.savedFilter.department = null;
      else
        this.savedFilter.department = val;
    }
  }

  search(keyword: string){
    if(keyword.length == 0){
      alert('검색어를 입력해주세요');
    }

    if(this.savedFilter.category != "" && this.savedFilter.college == ""){
      alert('구분만으론 검색이 불가합니다. 대분류도 선택해주세요.');
      return;
    }

    this.savedFilter.sliderOption = [];
    this.sliderChildren.toArray().forEach(slider=>{
      if(slider.getValues()[0] != 1 || slider.getValues()[1] != 5)
        this.savedFilter.sliderChange = true;

      this.savedFilter.sliderOption.push(slider.getValues()[0]+"-"+slider.getValues()[1]);
    });

    console.log(this.savedFilter);
    if(this.savedFilter.sliderChange || (this.savedFilter.year)!= "" || (this.savedFilter.term) != ""){
      this.lectureService.searchOption = this.savedFilter;

      this.router.navigateByUrl('/dummy', { skipLocationChange: true })
      setTimeout(()=> {
        this.router.navigate(['lecture/search/', keyword]);
      })
      /*
      if(this.searchValue == keyword){
      }else{

      }*/
    }else{
      this.router.navigate(['lecture/search/', keyword]);
    }

  }

  resetOption(){

  }
}


