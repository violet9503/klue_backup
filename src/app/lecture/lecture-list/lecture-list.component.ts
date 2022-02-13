import {Component, OnInit, OnDestroy, HostListener, Inject} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {LectureService} from '../lecture.service';
import {SharedService} from '../../shared-service';
import {SearchInfo, Lecture} from '../../object/lecture';
import {UserService} from '../../user.service';
import {DOCUMENT} from '@angular/platform-browser';
import {SvgKlue} from '../svg-klue';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'lecture-list',
  templateUrl: './lecture-list.component.html',
  styleUrls: ['./lecture-list.component.css']
})
export class LectureListComponent implements OnInit, OnDestroy {
  totalCount: number = 0;
  lectures: Lecture[];
  keyword: string;
  empty: boolean = false;
  isLoggedIn: boolean = false;
  evalAuth: boolean = false;
  lectures_load: boolean = false;
  page: number = 2;
  lectureEvalViewContent:string;
  lectureEvalWriteContent:string;
  savedObservable:any;
  order:string = "year_term";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lectureService: LectureService,
              private userService: UserService,
              private sharedService: SharedService,
              @Inject(DOCUMENT) private document: Document) {

    this.savedObservable = sharedService.changeLogin$.subscribe(
      state => {
        this.change(state);
      });
  }

  ngOnInit() {
    if(this.userService.userInfo){
      this.isLoggedIn = true;
      this.lectureEvalWriteContent = "강의평가 작성하기";
      if(this.userService.userInfo.read_lec_eval_authority){
        this.evalAuth = true;
        this.lectureEvalViewContent = "강의평가 보기";
      }else{
        this.lectureEvalViewContent = "열람 권한 없음";
      }
    }else{
      this.isLoggedIn = false;
      this.evalAuth = false;
      this.lectureEvalViewContent = "열람 권한 없음";
      this.lectureEvalWriteContent = "작성 권한 없음";
    }

    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.lectureService.search(params.get('keyword'), this.order))
      .subscribe(data => {
        this.keyword = this.route.snapshot.params['keyword'];
        this.sharedService.keywordChange(this.keyword);
        this.page = 2;
        this.totalCount = null;
        this.lectures = null;
        if(data.code == 200){
          if (data.data.length != 0) {
            this.empty = false;
            this.totalCount = data.total_count;
            this.lectures = data.data;
            this.canvasDraw();
            console.log(this.lectures);
          } else {
            this.empty = true;
          }
        }else{
          console.log(data);
        }
      });
  }


  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }

  change(state:boolean){
    if(state){
      this.isLoggedIn = true;
      this.lectureEvalWriteContent = "강의평가 작성하기";
      if(this.userService.userInfo.read_lec_eval_authority){
        this.evalAuth = true;
        this.lectureEvalViewContent = "강의평가 보기";
      }
    }else{
      this.isLoggedIn = false;
      this.evalAuth = false;
      this.lectureEvalWriteContent = "작성 권한 없음";
      this.lectureEvalViewContent = "열람 권한 없음";
    }
  }

  canvasDraw() {
    let drawPage:number = this.page;   //스크롤 빨리 했을때 page변경이 draw에는 반영되지 않도록 하기 위해 변수 선언.
    setTimeout(() => {
      for (let i = (drawPage - 2) * 10; i < this.lectures.length; i++) {
        let canvas = new SvgKlue("#lecture_" + this.lectures[i].id.toString());
        canvas.setSize(160);

        if(!this.evalAuth)
          canvas.forbid();
        else if(!this.lectures[i].star_difficulty && !this.lectures[i].star_grade && !this.lectures[i].star_studytime && !this.lectures[i].star_achievement && !this.lectures[i].star_attendance)
          canvas.empty();
        else if(!this.lectures[i].star_difficulty && !this.lectures[i].star_grade && !this.lectures[i].star_studytime){
          canvas.prev();
        } else
          canvas.draw(this.lectures[i].star_achievement, this.lectures[i].star_attendance, this.lectures[i].star_grade, this.lectures[i].star_difficulty, this.lectures[i].star_studytime);
      }
    }, 1000);
  }

  lectureEval(id: number) {
    this.router.navigate(['lecture/', id]);
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

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let body = this.document.body;
    let number = this.document.documentElement ? this.document.documentElement.scrollTop : body.scrollTop;
    if ((number > body.scrollHeight - window.innerHeight - 200) && !this.lectures_load) {
      if ((this.totalCount - 1) / 10 >= this.page - 1) {
        this.lecturesAppend();
        this.lectures_load = true;
      }
    }
  }

  lecturesAppend() {
    this.lectureService.search(this.keyword, this.order, this.page)
      .subscribe(data => {
        if (data.data) {
          data.data.forEach(lecture => this.lectures.push(lecture));
          this.canvasDraw();
          this.lectures_load = false;
          this.page += 1;
        }
      });
  }

  changeOrder(event){
    this.order = event.target.value;

    this.lectureService.search(this.keyword, this.order)
      .subscribe(data => {
      this.page = 2;
      this.lectures = null;
      if (data.data) {
        this.lectures = data.data;
        this.canvasDraw();
        console.log(this.lectures);
      } else {
        this.empty = true;
      }
    });
  }
}
