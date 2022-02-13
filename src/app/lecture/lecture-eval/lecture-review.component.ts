import {Component, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

import {LectureService} from '../lecture.service';

import {Evaluation, Comment} from '../../object/evaluation';

@Component({
  selector: 'lecture-review',
  templateUrl: './lecture-review.component.html',
  styleUrls: ['./lecture-review.component.css']
})
export class LectureReviewComponent implements AfterViewInit{
  @Input() evaluation: Evaluation;
  @Output() close = new EventEmitter<boolean>();
  @Output() changeComments = new EventEmitter<boolean>();
  comments: Comment[];

  constructor(private lectureService: LectureService) {
  }

  ngAfterViewInit() {
    this.viewReview();
  }

  closeReview() {
    this.close.emit(true);
  }

  viewReview() {
    this.lectureService.viewComment(this.evaluation.id).subscribe(data => {
      if(data.code == 200){
        this.comments = data.data;

        this.comments.forEach(comment => {
          if(comment.profile){
            comment.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+comment.profile;
          }else
            comment.profile = "/assets/img/Profile_Default.png";
        })
      }else{
        alert('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
        console.log(data);
      }

    });
  }

  registerReview(e) {
    if (e.value.length == 0) {
      alert('댓글을 입력해주세요.');
      return;
    }
    this.lectureService.registerComment(this.evaluation.id, e.value).subscribe(data =>{
      this.changeComments.emit(true);
      this.viewReview();
      e.value = null;
    });
  }

  deleteReview(commentId: number) {
    let deleteConfirm = confirm("정말로 댓글을 삭제하시겠습니까?");
    if (deleteConfirm) {
      this.lectureService.deleteComment(this.evaluation.id, commentId).subscribe(data => {
        if (data.code == 200) {
          alert('댓글 삭제가 완료되었습니다.');
          this.changeComments.emit(false);
          this.viewReview();
        } else {
          alert('오류가 발생하였습니다. 잠시 뒤 재시도 해주세요.');
          console.log(data);
        }
      })
    }
  }
}
