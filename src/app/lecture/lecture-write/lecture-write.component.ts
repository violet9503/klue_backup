import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location }                 from '@angular/common';

import { SliderKlue } from '../slider-klue';
import { LectureService} from '../lecture.service';
import { LectureEval } from '../../object/lecture';
import {SharedService} from '../../shared-service';

@Component({
  selector: 'lecture-write',
  templateUrl: './lecture-write.component.html',
  styleUrls: ['./lecture-write.component.css', '../slider-klue.css']
})
export class LectureWriteComponent implements OnInit{
  evalContent:string = "";
  slider: Array<SliderKlue> = [];
  totalContent:string = "최악 이에요";
  checkContent:string = "거의 안해요";
  diffContent:string = "완전 쉬워요";
  studyContent:string = "매우 적어요";
  gradeContent:string = "학점 짜게 줘요";
  achieveContent:string = "배운게 없어요";
  lectureEval:LectureEval = {contents:'', total:0, difficulty:0, studytime:0, attendance:0, grade:0, achievement:0};
  lectureId:string;
  @ViewChild('evalTyping') el: ElementRef;

  constructor(private route: ActivatedRoute, private lectureService: LectureService, private sharedService: SharedService, private location: Location ) {}

  ngOnInit(){
    if(!this.sharedService.savedEval){
      this.slider.push( new SliderKlue("#total_eval","star-full",true,"block").setValue(0.1));

      this.slider.push( new SliderKlue("#slider01","point-bar-full",true,"block").setValue(0.1));

      this.slider.push( new SliderKlue("#slider02","point-bar-full",true,"block").setValue(0.1));

      this.slider.push( new SliderKlue("#slider03","point-bar-full",true,"block").setValue(0.1));

      this.slider.push (new SliderKlue("#slider04","point-bar-full",true,"block").setValue(0.1));

      this.slider.push( new SliderKlue("#slider05","point-bar-full",true,"block").setValue(0.1));
    }else{
      let tempEval = this.sharedService.savedEval;

      this.slider.push( new SliderKlue("#total_eval","star-full",true,"block").setValue(tempEval.star_total/5-0.1));

      this.slider.push( new SliderKlue("#slider01","point-bar-full",true,"block").setValue(tempEval.star_attendance/5-0.1));

      this.slider.push( new SliderKlue("#slider02","point-bar-full",true,"block").setValue(tempEval.star_difficulty/5-0.1));

      this.slider.push( new SliderKlue("#slider03","point-bar-full",true,"block").setValue(tempEval.star_studytime/5-0.1));

      this.slider.push (new SliderKlue("#slider04","point-bar-full",true,"block").setValue(tempEval.star_grade/5-0.1));

      this.slider.push( new SliderKlue("#slider05","point-bar-full",true,"block").setValue(tempEval.star_achievement/5-0.1));

      this.evalContent = tempEval.content;
      this.el.nativeElement.value = tempEval.content;

      for(let i=0; i<=5; i++){
        this.clickPoint(i);
      }
    }
    this.lectureId = this.route.snapshot.params['id'];
  }

  clickPoint(state:number){
    switch(state){
      case 0:
        switch(this.slider[0].blockNumber){
          case 1: this.totalContent = "최악 이에요"; break;
          case 2: this.totalContent = "그저 그래요"; break;
          case 3: this.totalContent = "보통 이에요"; break;
          case 4: this.totalContent = "좋은 편이에요"; break;
          case 5: this.totalContent = "완전 좋아요"; break;
        } break;
      case 1: switch(this.slider[1].blockNumber){
        case 1: this.checkContent = "거의 안해요"; break;
        case 2: this.checkContent = "가끔 해요"; break;
        case 3: this.checkContent = "보통 이에요"; break;
        case 4: this.checkContent = "자주 해요"; break;
        case 5: this.checkContent = "항상 해요"; break;
      } break;
      case 2: switch(this.slider[2].blockNumber){
        case 1: this.diffContent = "완전 쉬워요"; break;
        case 2: this.diffContent = "조금 쉬워요"; break;
        case 3: this.diffContent = "보통 이에요"; break;
        case 4: this.diffContent = "조금 어려워요"; break;
        case 5: this.diffContent = "완전 어려워요"; break;
      } break;
      case 3: switch(this.slider[3].blockNumber){
        case 1: this.studyContent = "매우 적어요"; break;
        case 2: this.studyContent = "조금 적어요"; break;
        case 3: this.studyContent = "보통 이에요"; break;
        case 4: this.studyContent = "조금 많아요"; break;
        case 5: this.studyContent = "완전 많아요"; break;
      } break;
      case 4: switch(this.slider[4].blockNumber){
        case 1: this.gradeContent = "학점 짜게 줘요"; break;
        case 2: this.gradeContent = "그저 그래요"; break;
        case 3: this.gradeContent = "보통 이에요"; break;
        case 4: this.gradeContent = "잘 주세요"; break;
        case 5: this.gradeContent = "A+ 폭격기"; break;
      } break;
      case 5: switch(this.slider[5].blockNumber){
        case 1: this.achieveContent = "배운게 없어요"; break;
        case 2: this.achieveContent = "조금 적어요"; break;
        case 3: this.achieveContent = "보통 이에요"; break;
        case 4: this.achieveContent = "적당히 배웠어요"; break;
        case 5: this.achieveContent = "많이 배웠어요"; break;
      } break;
    }
  }

  contentTyping(event){
    this.evalContent = event.target.value;
  }

  register(){
    if(this.evalContent.length <= 20){
      alert("강의 평가를 20자 이상 남겨주세요.");
      return;
    }
    this.lectureEval.contents = this.evalContent;
    this.lectureEval.total = this.slider[0].blockNumber;
    this.lectureEval.attendance = this.slider[1].blockNumber;
    this.lectureEval.difficulty = this.slider[2].blockNumber;
    this.lectureEval.studytime = this.slider[3].blockNumber;
    this.lectureEval.grade = this.slider[4].blockNumber;
    this.lectureEval.achievement = this.slider[5].blockNumber;

    if(this.sharedService.savedEval){
      this.lectureService.rewriteEval(this.lectureId, this.lectureEval).subscribe(data => {
        if(data.code == 200){
          this.sharedService.savedEval = null;
          alert("강의 평가 수정이 완료되었습니다.");
          this.location.back();
        }else{
          alert("오류입니다.");
          console.log(data);
        }
      });
    }else{
      this.lectureService.registerEval(this.lectureId, this.lectureEval).subscribe(data => {
        if(data.code == 200){
          alert("강의 평가 등록이 완료되었습니다.");
          this.location.back();
        }else if(data.code == 50101){
          alert("이미 강의 평가를 등록하셨습니다.");
          this.location.back();
        }else{
          alert("오류입니다.");
          console.log(data);
        }
      });
    }
  }
}
