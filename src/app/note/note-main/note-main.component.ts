import {Component, OnInit, HostListener, Inject} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DOCUMENT} from '@angular/platform-browser';

import {NoteService} from '../note.service';
import {SharedService} from '../../shared-service';
import {RoutingService} from '../../routing.service';

import {Note} from '../../object/note';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'note-main',
  templateUrl: './note-main.component.html',
  styleUrls: ['./note-main.component.css', '../note-list/note-list.component.css']
})
export class NoteMainComponent implements OnInit{
  private s3_url = "https://s3.ap-northeast-2.amazonaws.com/kluedata/note_thumbnail";
  keyword: string;
  notes:Note[];
  lectures:any[];
  page:number;
  totalNoteCount: number = 0;
  totalLectureCount: number = 0;
  emptyNote: boolean = false;
  emptyLecture: boolean = false;
  isNoteSearch:boolean = true;
  isLectureSearch:boolean = true;
  noteMoreContent:string;
  lectureMoreContent:string;
  SearchNoResultContent:string;
  contentsLoading:boolean = false;

  constructor(private noteService:NoteService, private sharedService:SharedService, private route:ActivatedRoute, private routingService: RoutingService,
  @Inject(DOCUMENT) private document: Document){}

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.noteService.searchNoteKeyword(params.get('keyword'), 6))
      .subscribe(data => {
        this.keyword = this.route.snapshot.params['keyword'];
        this.sharedService.keywordChange(this.keyword);
        this.isNoteSearch = true;
        this.totalNoteCount = null;
        this.noteMoreContent = "공부노트 더보기";
        this.notes = null;
        console.log(data);
        if(data.code == 200){
          if (data.data.length != 0) {
            this.emptyNote = false;
            this.totalNoteCount = data.total_count;
            this.notes = data.data;

            this.notes.forEach(note => {
              if(note.profile){
                note.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+note.profile;
              }else
                note.profile = "/assets/img/Profile_Default.png";
            })
          } else {
            this.emptyNote = true;
          }
        }else{
          this.emptyNote = true;
        }
      });


    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.noteService.searchLecture(params.get('keyword'), null, null, 10))
      .subscribe(data => {
        this.totalLectureCount = null;
        this.isLectureSearch = true;
        this.lectureMoreContent = "강의 더보기";
        this.lectures = null;
        console.log(data);
        if(data.code == 200){
          if (data.data.length != 0) {
            this.emptyLecture = false;
            this.totalLectureCount = data.total_count;
            this.lectures = data.data;
          } else {
            this.emptyLecture = true;
          }
        }else if(data.code == 40101){
          this.emptyLecture = true;
          this.SearchNoResultContent = "로그인 후 검색이 가능합니다.";
        }else{
          this.emptyLecture = true;
          this.SearchNoResultContent = "검색 결과가 없습니다.";
        }
      });
  }

  clickMore(state:string){
    if(state == "note" && this.isLectureSearch){
      this.isLectureSearch = false;
      this.isNoteSearch = true;
      this.noteMoreContent = "돌아가기";
      this.notes = null;
      this.page = 2;
      this.noteService.searchNoteKeyword(this.keyword, 10).subscribe(data =>{
        if(data.code == 200){
          if (data.data.length != 0) {
            this.emptyNote = false;
            this.notes = data.data;

            this.notes.forEach(note => {
              if(note.profile){
                note.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+note.profile;
              }else
                note.profile = "/assets/img/Profile_Default.png";
            })
          } else {
            this.emptyNote = true;
          }
        }else{
          this.emptyNote = true;
        }
      })
    }else if(state == "lecture" && this.isNoteSearch){
      this.isNoteSearch = false;
      this.isLectureSearch = true;
      this.lectureMoreContent = "돌아가기";
      this.lectures = null;
      this.page = 2;
      this.noteService.searchLecture(this.keyword, null, null, 20).subscribe(data =>{
        if(data.code == 200){
          if (data.data.length != 0) {
            this.emptyLecture = false;
            this.lectures = data.data;
          } else {
            this.emptyLecture = true;
            this.SearchNoResultContent = "검색 결과가 없습니다.";
          }
        }else if(data.code == 40101){
          this.emptyLecture = true;
          this.SearchNoResultContent = "로그인 후 검색이 가능합니다.";
        }else{
          this.emptyLecture = true;
          this.SearchNoResultContent = "검색 결과가 없습니다.";
        }
      })
    }else if(!this.isLectureSearch || !this.isNoteSearch){
      this.isLectureSearch = true;
      this.isNoteSearch = true;
      this.noteMoreContent = "공부노트 더보기";
      this.lectureMoreContent = "강의 더보기";
      this.notes = this.notes.slice(0, 6);
      this.lectures = this.lectures.slice(0, 10);
    }
  }

  clickUpload(lecture){
    console.log(lecture);
    this.noteService.noteInfo.id = lecture.id;
    this.noteService.noteInfo.year = lecture.year;
    this.noteService.noteInfo.term = lecture.term;
    this.noteService.noteInfo.name = lecture.name;
    this.routingService.routing("note/upload", {id:lecture.id});
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if(this.isNoteSearch && this.isLectureSearch)
      return;

    let body = this.document.body;
    let number = this.document.documentElement ? this.document.documentElement.scrollTop : body.scrollTop;
    if ((number > body.scrollHeight - window.innerHeight - 200) && !this.contentsLoading) {
      if (((this.totalLectureCount - 1) / 20 >= this.page - 1) && this.isLectureSearch) {
        this.lecturesAppend();
        this.contentsLoading = true;
      }else if(((this.totalNoteCount - 1) / 10 >= this.page - 1) && this.isNoteSearch){
        this.notesAppend();
        this.contentsLoading = true;
      }
    }
  }

  lecturesAppend() {
    this.noteService.searchLecture(this.keyword, null, null, 20, this.page)
      .subscribe(data => {
        if (data.data) {
          data.data.forEach(lecture => this.lectures.push(lecture));
          this.contentsLoading = false;
          this.page += 1;
        }
      });
  }

  notesAppend(){
    this.noteService.searchNoteKeyword(this.keyword, 10, this.page)
      .subscribe(data => {
        if (data.data) {
          data.data.forEach(note => this.notes.push(note));
          this.contentsLoading = false;
          this.page += 1;
        }
      });
  }

  clickNoteView(state:number, id:number){
    if(state != 0)
      this.routingService.routing('note', id);
  }
}
