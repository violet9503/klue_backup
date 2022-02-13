import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Lecture } from '../../object/lecture';
import { LectureService } from '../lecture.service';
import { SliderKlue } from '../slider-klue';
import { SvgKlue } from '../svg-klue';


import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'lecture-info',
  templateUrl: './lecture-info.component.html',
  styleUrls: ['./lecture-info.component.css', '../slider-klue.css']
})
export class LectureInfoComponent implements OnInit {

  lecture: Lecture;
  slider:SliderKlue;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lectureService: LectureService) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.lectureService.viewLectureInfo(params.get('id')))
      .subscribe(data => {
        if(data.code == 200){
          this.lecture = data.data;
          console.log(data);
          this.canvasDraw();
        }else{
          alert('오류가 발생하였습니다. 잠시 후에 다시 시도해주세요.');
          this.router.navigate(['/']);
        }
      });
  }

  canvasDraw() {
    setTimeout (() => {
      if(!this.slider)
        this.slider = new SliderKlue("#total_eval","star-full",true,"inline");

      let canvas = new SvgKlue("#lecture_"+this.lecture.id.toString());
      canvas.setSize(200);

      if(!this.lecture.star_difficulty && !this.lecture.star_grade && !this.lecture.star_studytime && !this.lecture.star_achievement && !this.lecture.star_attendance)
        canvas.empty();
      else if(!this.lecture.star_difficulty && !this.lecture.star_grade && !this.lecture.star_studytime){
        canvas.prev();
      } else
        canvas.draw(this.lecture.star_achievement,this.lecture.star_attendance,this.lecture.star_grade,this.lecture.star_difficulty,this.lecture.star_studytime);

      this.slider.holdValue((this.lecture.star_total*2)/10);
    }, 1000);
  }


  lectureEval(e) {
    this.router.navigate(['lecture/', e.target.value]);
  }


  lectureWrite(id: number) {
    this.lectureService.writeCheck(id).subscribe(data => {
      if(data){
        alert('이미 이 강의에 대해 평가를 작성하셨습니다.');
        console.log(data);
      }else{
        this.router.navigate(['lecture/write', id]);
      }
    })
  }
}
