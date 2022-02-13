import {Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Evaluation, Evaluations } from '../../object/evaluation';
import {MypageService} from '../mypage.service';
import { SharedService } from '../../shared-service';
import { LectureService } from '../../lecture/lecture.service';
import { SliderKlue } from '../../lecture/slider-klue';

@Component({
  selector: 'mypage-eval',
  templateUrl: './mypage-eval.component.html',
  styleUrls: ['./mypage-eval.component.css', '../../lecture/slider-klue.css'],
  providers: [LectureService]
})
export class MypageEvalComponent {

  result:Evaluations = {total_count:0, data:Evaluation[0]};
  evaluations:Evaluation[];

  constructor(private router: Router,
              private mypageService: MypageService,
              private sharedService: SharedService,
              private lectureService: LectureService) { }

  ngOnInit() {
    this.mypageService.getMyEval().subscribe(data => {
      if(data.code != 200){
        alert('데이터를 받아오는데 실패했습니다.');
        console.log(data);
      }

      if(data.data.length != 0){
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
      }else{
        this.result = null;
      }
    });
  }

  pointDraw(){
    setTimeout(() => {
      for(let i = 0; i< this.evaluations.length; i++){
        let slider = new SliderKlue("#total_eval_"+this.evaluations[i].id,"star-full",true,"inline").holdValue((this.evaluations[i].star_total*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].id+"_1","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_attendance*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].id+"_2","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_difficulty*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].id+"_3","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_studytime*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].id+"_4","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_grade*2)/10);
        slider = new SliderKlue("#slider_"+this.evaluations[i].id+"_5","point-bar-full",true,"inline").holdValue((this.evaluations[i].star_achievement*2)/10);
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

  clickRewrite(evaluation:Evaluation){
    this.sharedService.savedEval = evaluation;
    this.router.navigate(['lecture/write', evaluation.lec_id]);
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
