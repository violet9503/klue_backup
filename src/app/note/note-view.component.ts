import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
//import { Location } from '@angular/common';

import {NoteService} from './note.service';

import {SharedService} from '../shared-service';
import {RoutingService} from '../routing.service';

@Component({
  selector: 'note-result',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css', '../../assets/css/carousel.css']
})
export class NoteViewComponent implements OnInit{
  private s3_url = "https://s3.ap-northeast-2.amazonaws.com/kluedata/note_thumbnail";
  id: string;
  noteContent: any;
  notePreview: string[] = [];
  reviewStatus:boolean = false;
  isOpen:boolean = false;
  isOut:boolean = true;

  constructor(private noteService:NoteService, private routingService: RoutingService, private route: ActivatedRoute){}

  ngOnInit(){
    this.id = this.route.snapshot.params['id'];

    this.noteService.viewNote(this.id).subscribe(data=>{
      console.log(data);
      if(data.code == 200){
        this.noteContent = data.data;

        if(this.noteContent.profile){
          this.noteContent.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+this.noteContent.profile;
        }else
          this.noteContent.profile = "/assets/img/Profile_Default.png";

        this.notePreview.push(`${this.s3_url}/${this.noteContent.file_path}/0`);

      }else if(data.code =40105){
        alert('잘못된 경로입니다.');
        this.routingService.routing('/');
      }else{
        alert('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }
    })
  }

  clickLike(){
    this.noteService.noteLike(this.id).subscribe(data=>{
      let result = data.json();
      if(result.code == 200){
        if(this.noteContent.like_status){
          this.noteContent.like_count--;
          this.noteContent.like_status = false;
        }else{
          this.noteContent.like_count++;
          this.noteContent.like_status = true;
        }
      }
    });
  }

  changeComments(changed: boolean){
    if(changed){
      this.noteContent.comments_count++;
    }else{
      this.noteContent.comments_count--;
    }
  }

  notePurchase(){
    this.noteService.notePurchase(this.id).subscribe(data=>{
      console.log(data);
    })
  }

  modalOut(){
    if(this.isOut)
      this.isOpen = false;
  }
/*
  clickReport(id:number){
    this.sharedService.reportEvaluationId = id;
    this.sharedService.stateChange('report');
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
  }*/
}
