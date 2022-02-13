import {Component, OnInit, HostListener, Inject } from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Evaluation, Evaluations } from '../../object/evaluation';
import { LectureService } from '../lecture.service';
import { SharedService } from '../../shared-service';
import { DOCUMENT } from '@angular/platform-browser';
import { SliderKlue } from '../slider-klue';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'lecture-eval',
  templateUrl: './lecture-eval.component.html',
  styleUrls: ['./lecture-eval.component.css', '../slider-klue.css']
})
export class LectureEvalComponent {

  result:Evaluations = {total_count:0, data:Evaluation[0]};
  evaluations:Evaluation[];
  empty:boolean;
  lectures_load: boolean = false;
  page: number = 2;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lectureService: LectureService,
              private sharedService: SharedService,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.lectureService.viewEval(params.get('id')))
      .subscribe(data => {
        this.page = 2;
        if(data.data){
          this.empty = false;
          this.result = data;
          this.evaluations = this.result.data;
          this.evaluations.forEach(evaluation => {
            if(evaluation.profile){
              evaluation.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/small/"+evaluation.profile;
            }else
              evaluation.profile = "/assets/img/Profile_Default.png";
          })

          console.log(data);
          this.pointDraw();
        } else{
          this.evaluations = null;
          this.empty = true;
        }
      });
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    let body = this.document.body;
    let number = this.document.documentElement ? this.document.documentElement.scrollTop : body.scrollTop;
    if ( (number >  body.scrollHeight - window.innerHeight - 200) && !this.lectures_load) {
      if((this.result.total_count-1)/5 >= this.page-1){
        this.evalAppend();
        this.lectures_load = true;
      }
    }
  }

  evalAppend(){
    this.lectureService.viewEval(this.route.snapshot.params['id'], this.page)
      .subscribe(data => {
        if(data.data) {
          data.data.forEach(evaluation => {
            if (evaluation.profile) {
              evaluation.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/small/" + evaluation.profile;
            } else
              evaluation.profile = "/assets/img/Profile_Default.png";

            this.evaluations.push(evaluation);
          });
          this.lectures_load = false;
          this.page += 1;
          this.pointDraw();
        }
      });
  }

  pointDraw(){
    let drawPage = this.page;
    setTimeout(() => {
      for(let i = (drawPage -2)*5; i< this.evaluations.length; i++){
        let slider = new SliderKlue("#total_eval_"+this.evaluations[i].user_id,"star-full",true,"inline").holdValue((this.evaluations[i].star_total*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].user_id+"_1","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_attendance*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].user_id+"_2","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_difficulty*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].user_id+"_3","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_studytime*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].user_id+"_4","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_grade*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].user_id+"_5","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_achievement*2)/10);
      }
    }, 1000);
  }

  clickLike(evaluation:Evaluation){
    this.lectureService.evalLike(evaluation.id).subscribe(data=>{
      let result = data.json();
      if(result.code == 200){
        if(evaluation.like_status){
          evaluation.like_count--;
          evaluation.like_status = false;
        }else{
          evaluation.like_count++;
          evaluation.like_status = true;
        }
      }
    });
  }

  clickReview(evaluation:Evaluation){
    evaluation.comments_status = !evaluation.comments_status;
  }

  closeReview(evaluation:Evaluation){
    evaluation.comments_status = false;
  }

  changeComments(evaluation:Evaluation, changed: boolean){
    if(changed){
      evaluation.comments_count++;
    }else{
      evaluation.comments_count--;
    }
  }

  clickReport(id:number){
    this.sharedService.reportEvaluationId = id;
    this.sharedService.stateChange('report');
  }

  clickRewrite(evaluation:Evaluation){
    if(evaluation.write_status == 1){
      this.sharedService.savedEval = evaluation;
      this.router.navigate(['lecture/write', evaluation.lec_id]);
    }else{
      alert('잘못된 접근입니다.');
      return;
    }
  }

  clickDelete(id:number){
    let deleteConfirm = confirm("정말로 강의평을 삭제하시겠습니까?");
    if(deleteConfirm){
      this.lectureService.deleteEval(id).subscribe(data =>{
        if(data.code == 200){
          alert('강의평 삭제가 완료되었습니다.');
          window.location.reload();
        }else{
          alert('오류가 발생하였습니다. 잠시 뒤 재시도 해주세요.');
          console.log(data);
        }
      })
    }
  }
}
