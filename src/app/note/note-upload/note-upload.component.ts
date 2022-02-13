import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subject} from 'rxjs/Subject';

import {Lecture} from '../../object/lecture';

import {NoteService} from '../note.service';

@Component({
  selector: 'note-upload',
  templateUrl: './note-upload.component.html',
  styleUrls: ['./note-upload.component.css']
})

export class NoteUploadComponent implements OnInit, OnDestroy {
  isRelative: boolean = false;
  contentLength: number = 0;
  isFree: boolean = true;
  fileArray: any[] = [];
  lectures: Lecture[];
  totalCount: number;
  optionYear: string[] = [];
  optionTerm: string[] = ["1학기", "2학기", "여름학기", "겨울학기"];
  savedLecture = {year: "", term: "", id: 0, name: ""};
  savedRelative = {keyword: "", year: "", term: ""}
  page: number;
  contentsLoading:boolean = false;
  isOpen:boolean = false;
  hashPattern = /(#[a-zA-Z0-9\-_.!@$%^&*()+/|=ㄱ-ㅎㅏ-ㅣ가-힣]*)/g;

  constructor(private route: ActivatedRoute, private router: Router, private noteService: NoteService, private location: Location) {}


  ngOnInit() {
    this.noteService.getYear().subscribe(data => {
      for (let i = data.write_note_year; i >= 2012; i--) {
        this.optionYear.push(i);
      }
    })

    if(this.router.url.split(';')[1]){
      if(this.router.url.split(';')[1].split('=')[1] == this.noteService.noteInfo.id.toString() && this.noteService.noteInfo.id != 0){
        this.isRelative = true;
        this.savedLecture.id = this.noteService.noteInfo.id;
        this.savedLecture.name = this.noteService.noteInfo.name;
        this.savedLecture.year = this.noteService.noteInfo.year;
        this.savedLecture.term = this.noteService.noteInfo.term;
      }
    }
  }

  ngOnDestroy() {
    this.noteService.noteInfo.id = 0;
  }

  changeRelative(state: boolean, label) {
    if (state)
      this.isRelative = true;
    else {
      this.savedLecture.id = 0;
      this.savedLecture.name = "";
      this.savedLecture.year = "";
      this.savedLecture.term = "";
      this.lectures = null;
      this.isRelative = false;
      label.getElementsByTagName('label')[1].style.color = '#4a4a4a';
      label.getElementsByTagName('label')[0].style.color = '#bbbbbb';
    }
  }


  contentTyping(length: number) {
    this.contentLength = length;
  }

  register(contents: string, checked: boolean, title: string, category: string, hash: string) {
    if (!checked && !this.isRelative) {
      alert('관련 강의 여부를 선택해 주세요.');
      return;
    } else if (this.isRelative && this.savedLecture.id == 0) {
      alert('자료와 관련된 강의를 검색하고 선택해 주세요.');
      return;
    } else if (title.length == 0) {
      alert('노트 제목을 입력해 주세요.');
      return;
    } else if (category.length == 0) {
      alert('노트 카테고리를 선택해 주세요.');
      return;
    } else if (contents.length <= 10) {
      alert("노트 내용을 10자 이상 남겨주세요.");
      return;
    } else if (!this.fileArray) {
      alert("파일을 하나 이상 업로드 해주세요.");
      return;
    }
    let noteData = new FormData();
    this.isOpen = true;

    for (let i = 0; i < this.fileArray.length; i++) {
      noteData.append('notes[]', this.fileArray[i]);
    }

    if(hash.length != 0){
      let tempArray = hash.match(this.hashPattern);
      let hashArray:string[] = [];

      if(tempArray.length == 0)
        return;

      tempArray.forEach(function (hash, index, arr) {
        if (hash.length > 1)
          hashArray.push(hash.slice(1));
      });

      for (let i = 0; i < hashArray.length; i++) {
        console.log(hashArray[i]);
        noteData.append('hash_tag[]', hashArray[i]);
      }
    }

    noteData.append('title', title);
    noteData.append('contents', contents);
    noteData.append('type', category);
    noteData.append('is_free', "1");


    if (this.savedLecture.id != 0)
      noteData.append('lec_id', this.savedLecture.id.toString());

    this.noteService.uploadNote(noteData).subscribe(data => {
      console.log(data);
      if (data.code == 200){
        alert('업로드에 성공했습니다.');
        this.location.back();
      }else{
        alert('업로드하는데 오류가 생겼습니다. 잠시 후에 시도해주세요.');
      }

      this.isOpen = false;
    })
  }

  fileSelect(event) {
    let files = event.target.files || event.srcElement.files;

    if (!files) {
      return;
    } else {
      for (let i = 0; i < files.length; i++) {
        let extension = files[i].name.split(".").pop().toLowerCase();
        if(extension == "jpeg")
          extension = "jpg";

        files[i].extension = "/assets/img/StudyNote_Format_"+extension+".png";
        this.fileArray.push(files[i]);
      }
      console.log(this.fileArray);
      event.target.value = null;
    }
  }

  fileRemove(index) {
    this.fileArray.splice(index, 1);
  }

  searchLecture(keyword: string, year: string, term: string, state?: boolean) {
    if (keyword.length < 2){
      this.lectures = null;
      return;
    }

    if (this.savedRelative.keyword == keyword && this.savedRelative.year == year && this.savedRelative.term == term && !state)
      return;

    this.savedRelative.keyword = keyword;
    this.savedRelative.year = year;
    this.savedRelative.term = term;
    this.savedLecture.id = 0; //선택했던 강의 초기화
    this.page = 2;

    console.log(keyword);
    this.noteService.searchLecture(keyword, year, term, 10).subscribe(data => {
      console.log(data);
      if (data.code == 200) {
        this.totalCount = data.total_count;
        if (data.total_count != 0)
          this.lectures = data.data;
        else
          this.lectures = null;
      }
    })
  }

  onScroll(event) {
    let div = event.target || event.srcElement;

    if((div.scrollTop > div.scrollHeight - div.clientHeight - 200) && !this.contentsLoading){
      if ((this.totalCount - 1) / 10 >= this.page - 1){
        this.contentsLoading = true;
        this.lecturesAppend();
      }
    }
  }

  lecturesAppend() {
    this.noteService.searchLecture(this.savedRelative.keyword, this.savedRelative.year, this.savedRelative.term, 10, this.page)
      .subscribe(data => {
        console.log(data)
        if(data.code == 200 && data.total_count != 0){
          data.data.forEach(lecture => this.lectures.push(lecture));
          this.page += 1;
          this.contentsLoading = false;
        }
      });
  }

  selectLecture(lecture: Lecture) {
    console.log(lecture);
    if(lecture){
      this.savedLecture.id = lecture.id;
      this.savedLecture.name = lecture.name;
      this.savedLecture.year = lecture.year;
      this.savedLecture.term = lecture.term;
    }
    setTimeout(()=> {
      this.lectures = null;
    }, 200);
  }
}
