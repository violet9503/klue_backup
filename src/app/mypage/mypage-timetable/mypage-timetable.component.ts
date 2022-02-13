import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer, Inject, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {MypageService} from '../mypage.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {Lecture} from '../../object/lecture';
import {DOCUMENT} from '@angular/platform-browser';

import 'rxjs/add/operator/switchMap';

declare var html2canvas: any;

@Component({
  selector: 'mypage-timetable',
  templateUrl: './mypage-timetable.component.html',
  styleUrls: ['./mypage-timetable.component.css'],
  animations: [
    trigger('searchIn', [
      transition('void => in', [
        style({transform: 'translateY(100%) scale(1)'}),
        animate(200)
      ]),
      transition('in => void', [
        animate(200, style({transform: 'translateY(100%) scale(1)'}))
      ])
    ])
  ]
})

export class MypageTimetableComponent implements OnInit, AfterViewInit, OnDestroy {
  isEmpty: boolean = false;
  isSearch: boolean = false;
  iskeyword: boolean = true;
  isTimeFilter: boolean = false;
  tableId: string;                //현재 시간표 id
  lectureList: Lecture[] = [];    //검색할때 나오는 강의 목록 리스트
  tableEl: any;                   //table Element 제어위한 변수
  randomcolor: string[] = ["#BACFBF", "#F1D6AB", "#C9CBDA", "#BED6D8", "#ECAA9A", "#8DA1B9", "#DBC7BE", "#CBB3BF", "#95ADB6", "#EF959C",
    "#BACFBF", "#F1D6AB", "#C9CBDA", "#BED6D8", "#ECAA9A", "#8DA1B9", "#DBC7BE", "#CBB3BF", "#95ADB6", "#EF959C"];

  savedLecture:Lecture[] = [];
  savedLectureId: number[] = [];    //lecture id 저장
  savedEl: any[] = [];            //table내 저장된 강의들 element
  savedListener: any[] = [];      //저장된 강의들 element event
  savedFilterListener: any[] = [];//필터링 할때 시간 선택할때 쓰는 event
  savedTime: any[] = [];          //강의 시간들 저장
  savedFilterTime: string[] = []; //필터링한 시간 저장
  savedType: string[];            //필터링 카테고리, 타입 등 저장
  savedCategory: string[];
  savedCollege: string[];
  resultLoad: boolean = false;
  page: number;
  totalCount: number;
  totalCredit: number = 0;
  searchKeyword: string;
  filterChecked: boolean = false;
  checkingLecture: Lecture;
  savedObservable: any[] = [];
  hiddenTag: HTMLAnchorElement;

  @ViewChild('timetable') el: ElementRef;
  @ViewChild('filter') el2: ElementRef;
  @ViewChild('timeCondition') el3: ElementRef;
  @ViewChild('tapContainer') el4: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mypageService: MypageService,
              private renderer: Renderer,
              @Inject(DOCUMENT) private document: Document) {

    this.savedObservable.push(mypageService.requestImg$.subscribe(
      name => this.saveImg(name)
    ));

    this.savedObservable.push(mypageService.requestRewrite$.subscribe(
      name => this.nameRewrite(name)
    ));
  }


  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.mypageService.getTable(params.get('id')))
      .subscribe(data => {
        console.log(data);
        if(data.code == 200) {
          this.clearVariable();
          this.tableId = this.route.snapshot.params['id'];
          this.mypageService.year = data.data.year;
          this.mypageService.term = data.data.term;
          this.mypageService.tableRequest(true);
          if (data.data.lectures.length != 0) {
            data.data.lectures.forEach(lecture => this.lectureSelect(lecture));
          }
        }else if(this.route.snapshot.params['id']== "0"){
          this.isEmpty = true;
        }
      });
  }

  ngAfterViewInit(){
    if(!this.isEmpty)
      this.tableEl = this.el.nativeElement.children[0].children;
  }

  ngOnDestroy(){
    this.savedObservable.forEach(Subject => Subject.unsubscribe());
  }

  searchTapControl(state: boolean) {
    this.isSearch = state;
    if (!state) {
      this.iskeyword = true;
      this.isTimeFilter = false;
      this.savedFilterTime = [];
      this.savedCategory = null;
      this.savedCollege = null;
      this.lectureList = [];
      this.searchKeyword = "";
    }
  }

  changeTap(state: boolean) {
    this.iskeyword = state;
    this.filterChecked = false;
    this.lectureList = [];
    if (!state) {
      this.savedFilterTime = [];
      this.savedCategory = null;
      this.savedCollege = null;
      this.mypageService.getCategory().subscribe(data => {
        if (data.code == 200)
          this.savedType = data.data;
        else
          console.log("getCategory error " + data.code);
      })
    }
  }

  lectureSearch(keyword: string, page?: number) {
    let tempId: string;
    if (this.filterChecked)
      tempId = this.tableId;
    else
      tempId = "0";

    if (page) {
      this.mypageService.search(keyword, tempId, page).subscribe(
        data => {
          if (data.code == 200) {
            data.data.forEach(lecture => this.lectureList.push(lecture));
            this.resultLoad = false;
            this.page += 1;
          } else {
            console.log('Search Error' + data.code);
          }
        }
      )
    } else {
      this.page = 2;
      this.searchKeyword = keyword;
      this.lectureList = [];

      if (this.checkingLecture)
        this.lectureTimeCheck(this.checkingLecture, false);

      this.mypageService.search(keyword, tempId).subscribe(
        data => {
          if (data.code == 200) {
            this.totalCount = data.total_count;
            this.lectureList = data.data;
          } else {
            console.log('Search Error' + data.code);
          }
        }
      )
    }
  }

  lectureTimeCheck(lecture: Lecture, state: boolean) {
    let time: string[] = [];
    lecture.time.replace(/(\[|\]|"| )/g, "").split(",").forEach(data => time.push(data));
    for (let i = 0; i < time.length; i++) {
      let day = time[i].slice(0, 1);
      let firstTime;
      let lastTime;
      if (time[i].length > 5) {
        firstTime = parseInt(time[i].slice(2, -1));
        lastTime = parseInt(time[i].slice(4, -1));

        if (parseInt(time[i].slice(2, -1)) <= 0)
          firstTime = 1;
        else if (parseInt(time[i].slice(2, -1)) > 8)
          return;
        else if (parseInt(time[i].slice(4, -1)) > 8)
          lastTime = 8;

        for (let j = firstTime; j <= lastTime; j++) {
          switch (day) {
            case "월" :
              this.renderer.setElementClass(this.tableEl[j].children[1], "mypage-timetable-lecture-mouseover", state);
              break;
            case "화" :
              this.renderer.setElementClass(this.tableEl[j].children[2], "mypage-timetable-lecture-mouseover", state);
              break;
            case "수" :
              this.renderer.setElementClass(this.tableEl[j].children[3], "mypage-timetable-lecture-mouseover", state);
              break;
            case "목" :
              this.renderer.setElementClass(this.tableEl[j].children[4], "mypage-timetable-lecture-mouseover", state);
              break;
            case "금" :
              this.renderer.setElementClass(this.tableEl[j].children[5], "mypage-timetable-lecture-mouseover", state);
              break;
          }
        }
      } else {
        if (parseInt(time[i].slice(2, -1)) > 8)
          return;
        else if (parseInt(time[i].slice(2, -1)) <= 0)
          return;
        else
          firstTime = parseInt(time[i].slice(2, -1));

        switch (day) {
          case "월" :
            this.renderer.setElementClass(this.tableEl[firstTime].children[1], "mypage-timetable-lecture-mouseover", state);
            break;
          case "화" :
            this.renderer.setElementClass(this.tableEl[firstTime].children[2], "mypage-timetable-lecture-mouseover", state);
            break;
          case "수" :
            this.renderer.setElementClass(this.tableEl[firstTime].children[3], "mypage-timetable-lecture-mouseover", state);
            break;
          case "목" :
            this.renderer.setElementClass(this.tableEl[firstTime].children[4], "mypage-timetable-lecture-mouseover", state);
            break;
          case "금" :
            this.renderer.setElementClass(this.tableEl[firstTime].children[5], "mypage-timetable-lecture-mouseover", state);
            break;
        }
      }
    }

    if (state)
      this.checkingLecture = lecture;
    else
      this.checkingLecture = null;
  }

  lectureSelect(lecture: Lecture) {
    this.lectureTimeCheck(lecture, false);
    let time: string[] = [];
    let location: string[] = [];
    let tempEl: any[] = [];
    let tempListener: Function[] = [];
    let dayIndex: number;
    let color = this.randomcolor.pop();
    lecture.time.replace(/(\[|\]|"| )/g, "").split(",").forEach(data => time.push(data));
    if (lecture.location)
      lecture.location.replace(/(\[|\]|"| )/g, "").split(",").forEach(data => location.push(data));
    else
      location.push("");

    if (this.lectureDuplicateCheck(time)) {
      alert('이미 같은 시간대에 등록된 강의가 있습니다.');
      return;
    }

    for (let i = 0; i < time.length; i++) {
      let day = time[i].slice(0, 1);
      let firstTime, lastTime;

      if (time[i].length > 5) {
        firstTime = parseInt(time[i].slice(2, -1));
        lastTime = parseInt(time[i].slice(4, -1));

        if (parseInt(time[i].slice(2, -1)) <= 0)
          firstTime = 1;
        else if (parseInt(time[i].slice(2, -1)) > 8)
          return;
        else if (parseInt(time[i].slice(4, -1)) > 8)
          lastTime = 8;
      }
      else {
        firstTime = parseInt(time[i].slice(2, -1));
        lastTime = parseInt(time[i].slice(2, -1));

        if (parseInt(time[i].slice(2, -1)) > 8)
          return;
        else if (parseInt(time[i].slice(2, -1)) <= 0)
          return;
      }

      for (let j = firstTime; j <= lastTime; j++) {
        switch (day) {
          case "월" :
            dayIndex = 1;
            break;
          case "화" :
            dayIndex = 2;
            break;
          case "수" :
            dayIndex = 3;
            break;
          case "목" :
            dayIndex = 4;
            break;
          case "금" :
            dayIndex = 5;
            break;
        }
        this.renderer.setElementStyle(this.tableEl[j].children[dayIndex], "background-color", color);
        this.renderer.setElementProperty(this.tableEl[j].children[dayIndex], "lectureId", lecture.id);
        tempListener.push(this.renderer.listen(this.tableEl[j].children[dayIndex], 'mouseenter', (event) => {
          this.controlCloseButton(lecture, true)
        }));

        tempListener.push(this.renderer.listen(this.tableEl[j].children[dayIndex], 'mouseleave', (event) => {
          this.controlCloseButton(lecture, false)
        }));

        this.tableEl[j].children[dayIndex].children[1].children[0].innerHTML = lecture.name.slice(0, 30);
        this.tableEl[j].children[dayIndex].children[1].children[1].innerHTML = location[i];
        tempEl.push(this.tableEl[j].children[dayIndex]);
      }
    }
    this.savedLecture.push(lecture);
    console.log(this.savedLecture);
    this.savedLectureId.push(lecture.id);
    this.savedEl.push(tempEl);
    this.savedListener.push(tempListener);
    this.totalCredit += lecture.credit;
    this.mypageService.putTable(this.tableId, this.savedLectureId).subscribe();

    console.log(this.savedLectureId);
  }

  controlCloseButton(lecture: Lecture, state: boolean) {
    if (this.isTimeFilter)
      return;

    let lectureId: number;
    let text: string;
    if (state)
      text = `<span>×</span>`;
    else
      text = "";

    for (let i = 0; i < this.savedLectureId.length; i++) {
      if (this.savedLectureId[i] == lecture.id) {
        lectureId = i;
        break;
      }
    }

    if (lectureId == null)
      return;

    for (let i = 0; i < this.savedEl[lectureId].length; i++) {
      this.savedEl[lectureId][i].children[0].innerHTML = text;
      if (state) {
        this.renderer.listen(this.savedEl[lectureId][i].children[0].children[0], 'click', (event) => {
          this.deleteLecture(lecture, false);
        });
      }
    }
  }

  deleteLecture(lecture: Lecture, isRefresh:boolean) {
    let lectureId: number;
    let time: string[] = [];
    let tempTime: string[] = [];

    lecture.time.replace(/(\[|\]|"| )/g, "").split(",").forEach(data => time.push(data));

    for (let i = 0; i < time.length; i++) {
      if (time[i].length == 4) {
        tempTime.push(time[i].replace("(", "").replace(")", ""));
      }
      else {
        for (let j = parseInt(time[i].slice(2, -1)); j <= parseInt(time[i].slice(4, -1)); j++) {
          let tempString = time[i].slice(0, 1) + j.toString();
          tempTime.push(tempString);
        }
      }
    }

    tempTime.forEach(time => {
      for (let i = 0; i < this.savedTime.length; i++) {
        if (this.savedTime[i] == time)
          this.savedTime.splice(i, 1);
      }
    });

    for (let i = 0; i < this.savedLectureId.length; i++) {
      if (this.savedLectureId[i] == lecture.id) {
        lectureId = i;
        break;
      }
    }

    if (lectureId == null)
      return;

    this.controlCloseButton(lecture, false);

    for (let i = 0; i < this.savedListener[lectureId].length; i++) {
      this.savedListener[lectureId][i]();
    }

    for (let i = 0; i < this.savedEl[lectureId].length; i++) {
      this.savedEl[lectureId][i].children[1].children[0].innerHTML = "";
      this.savedEl[lectureId][i].children[1].children[1].innerHTML = "";
      this.renderer.setElementStyle(this.savedEl[lectureId][i], "background-color", "#fafafa");
    }

    this.savedEl.splice(lectureId, 1);
    this.savedLectureId.splice(lectureId, 1);
    this.savedListener.splice(lectureId, 1);
    this.totalCredit -= lecture.credit;

    if(!isRefresh){
      this.mypageService.putTable(this.tableId, this.savedLectureId).subscribe();
      this.savedLecture.splice(lectureId, 1);
    }
  }

  lectureDuplicateCheck(time: string[]) {
    let tempTime: string[] = [];
    let state: boolean = false;

    for (let i = 0; i < time.length; i++) {
      if (time[i].length == 4) {
        tempTime.push(time[i].replace("(", "").replace(")", ""));
      }
      else {
        for (let j = parseInt(time[i].slice(2, -1)); j <= parseInt(time[i].slice(4, -1)); j++) {
          let tempString = time[i].slice(0, 1) + j.toString();
          tempTime.push(tempString);
        }
      }
    }

    tempTime.forEach(time => {
      if (this.savedTime.findIndex(x => x == time) != -1)
        state = true;
    });

    if (!state) {
      tempTime.forEach(time => this.savedTime.push(time));
    }

    return state;
  }

  filterChange(event, category?: string) {

    if (event.target.value == "") {
      if (category)
        this.savedCollege = null;
      else {
        this.savedCategory = null;
        this.savedCollege = null;
      }

      return;
    }

    if (category) {
      this.mypageService.getCategory(category, event.target.value).subscribe(data => {
        if (data.code == 200) {
          if (data.data[0].department == null) {
            this.savedCollege = null;
            return;
          }
          else
            this.savedCollege = data.data;
        } else {
          console.log("getCategory error " + data.code);
        }
      })
    } else {
      this.mypageService.getCategory(event.target.value).subscribe(data => {
        if (data.code == 200) {
          this.savedCollege = null;
          this.savedCategory = data.data;
        } else {
          console.log("getCategory error " + data.code);
        }
      })
    }
  }

  filterSearch(page?: number) {
    let selectElements = this.el2.nativeElement.getElementsByTagName('select');
    let type, college, department;
    let tempId: string;

    if (this.filterChecked)
      tempId = this.tableId;
    else
      tempId = "0";

    if (selectElements[0].value == "") {
      alert('강의 분류에서 구분을 선택해주세요');
      return;
    } else if (selectElements[0].value == "전공") {
      if (selectElements[1].value == "") {
        alert('대분류를 선택해주세요.');
        return;
      } else if (selectElements[2].value == "") {
        type = null;
        college = selectElements[1].value;
        department = null;
      } else {
        type = null;
        college = selectElements[1].value;
        department = selectElements[2].value;
      }
    } else {
      if (selectElements[1].value == "") {
        alert('대분류을 선택해주세요.');
        return;
      } else if (selectElements.length == 2 || selectElements[2].value == "") {
        type = selectElements[1].value;
        college = null;
        department = null;
      } else {
        type = null;
        college = null;
        department = selectElements[2].value;
      }
    }

    if (this.savedFilterTime.length == 0) {
      if (page) {
        this.mypageService.filterSearch(tempId, type, college, department, page).subscribe(
          data => {
            if (data.code == 200) {
              data.data.forEach(lecture => this.lectureList.push(lecture));
              this.resultLoad = false;
              this.page += 1;
            } else {
              console.log('Search Error' + data.code);
            }
          }
        )
      } else {
        this.page = 2;
        this.lectureList = [];

        if (this.checkingLecture)
          this.lectureTimeCheck(this.checkingLecture, false);

        this.mypageService.filterSearch(tempId, type, college, department).subscribe(
          data => {
            if (data.code == 200) {
              this.totalCount = data.total_count;
              this.lectureList = data.data;
            } else {
              console.log('Search Error' + data.code);
            }
          }
        )
      }
    } else {
      let condition: boolean = this.el3.nativeElement.getElementsByTagName('input')[0].checked;
      if (page) {
        this.mypageService.filterSearchWithTime(this.savedFilterTime, condition, type, college, department, page).subscribe(
          data => {
            if (data.code == 200) {
              data.data.forEach(lecture => this.lectureList.push(lecture));
              this.resultLoad = false;
              this.page += 1;
            } else {
              console.log('Search Error' + data.code);
            }
          }
        )
      } else {
        this.page = 2;
        this.lectureList = [];

        if (this.checkingLecture)
          this.lectureTimeCheck(this.checkingLecture, false);

        this.mypageService.filterSearchWithTime(this.savedFilterTime, condition, type, college, department).subscribe(
          data => {
            if (data.code == 200) {
              this.totalCount = data.total_count;
              this.lectureList = data.data;
            } else {
              console.log('Search Error' + data.code);
            }
          }
        )
      }
    }
  }


  onSearchScroll(event) {
    let number = event.target.scrollTop;
    if ((number > event.target.scrollHeight - 370) && !this.resultLoad) {
      if ((this.totalCount - 1) / 30 >= this.page - 1) {
        this.resultLoad = true;
        this.lecturesAppend();
      }
    }
  }

  lecturesAppend() {
    if (this.iskeyword)
      this.lectureSearch(this.searchKeyword, this.page);
    else
      this.filterSearch(this.page);
  }

  bodyScrollControl(state: boolean) {
    let body = this.document.body;
    if (state)
      body.style.overflow = "hidden";
    else
      body.style.overflow = "";
  }

  timeSelect() {
    this.renderer.setElementStyle(this.el4.nativeElement, "display", "none");
    this.isTimeFilter = true;

    for (let i = 1; i < this.tableEl.length; i++) {
      for (let j = 1; j < this.tableEl[0].children.length; j++) {
        if (this.tableEl[i].children[j].style.backgroundColor == "" || this.tableEl[i].children[j].style.backgroundColor == "rgb(250, 250, 250)") {
          this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-notselect", true);
          this.savedFilterListener.push(this.renderer.listen(this.tableEl[i].children[j], 'click', (event) => {
            if (this.tableEl[i].children[j].classList[1] == "mypage-timetable-time-notselect") {
              this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-notselect", false);
              this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-select", true);
            }
            else if (this.tableEl[i].children[j].classList[1] == "mypage-timetable-time-select") {
              this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-select", false);
              this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-notselect", true);
            }
          }));
        }
      }
    }

    if (this.savedFilterTime) {
      for (let i = 0; i < this.savedFilterTime.length; i++) {
        switch (this.savedFilterTime[i].slice(0, 1)) {
          case "월" :
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[1], "mypage-timetable-time-notselect", false);
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[1], "mypage-timetable-time-select", true);
            break;
          case "화" :
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[2], "mypage-timetable-time-notselect", false);
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[2], "mypage-timetable-time-select", true);
            break;
          case "수" :
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[3], "mypage-timetable-time-notselect", false);
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[3], "mypage-timetable-time-select", true);
            break;
          case "목" :
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[4], "mypage-timetable-time-notselect", false);
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[4], "mypage-timetable-time-select", true);
            break;
          case "금" :
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[5], "mypage-timetable-time-notselect", false);
            this.renderer.setElementClass(this.tableEl[parseInt(this.savedFilterTime[i].slice(1))].children[5], "mypage-timetable-time-select", true);
            break;
        }
      }
      this.savedFilterTime = [];
    }
  }

  timeSelectComplete(state: boolean) {
    this.renderer.setElementStyle(this.el4.nativeElement, "display", "block");
    this.isTimeFilter = false;

    for (let i = 1; i < this.tableEl.length; i++) {
      for (let j = 1; j < this.tableEl[0].children.length; j++) {
        this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-notselect", false);
        if (this.tableEl[i].children[j].classList[1] == "mypage-timetable-time-select") {
          this.renderer.setElementClass(this.tableEl[i].children[j], "mypage-timetable-time-select", false);
          switch (j) {
            case 1 :
              this.savedFilterTime.push("월" + i);
              break;
            case 2 :
              this.savedFilterTime.push("화" + i);
              break;
            case 3 :
              this.savedFilterTime.push("수" + i);
              break;
            case 4 :
              this.savedFilterTime.push("목" + i);
              break;
            case 5 :
              this.savedFilterTime.push("금" + i);
              break;
          }
        }
      }
    }
    for (let i = 0; i < this.savedFilterListener.length; i++) {
      this.savedFilterListener[i]();
    }
    this.savedFilterListener = [];
    if (!state) {
      this.savedFilterTime = [];
    }
  }

  saveImg(name: string) {
    let temp = this.el.nativeElement.parentElement.parentElement;

    new html2canvas(temp, {
      dpi: 288,
      onrendered: function (canvas) {
        var hiddenTag = document.createElement('a');
        hiddenTag.href = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        hiddenTag.download = name + '.jpg';
        hiddenTag.click();
      }
    })
  }

  filterCheck(event) {
    this.filterChecked = event.target.checked;
  }

  nameRewrite(name:string){
    this.mypageService.putTable(this.tableId, this.savedLectureId, name).subscribe(data => {
      if(data.code == 200){
        alert("시간표 이름 수정이 완료되었습니다.");
        window.location.reload();
      }else{
        alert("이름 수정에 실패했습니다. 잠시 후에 다시 시도해주세요");
        console.log(data);
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  clearVariable(){
    this.isEmpty = false;
    this.filterChecked = false;
    this.resultLoad = false;
    if(this.isTimeFilter)
      this.timeSelectComplete(false);

    this.savedLecture.forEach(lecture => {
      this.deleteLecture(lecture, true);
    });
    this.savedLecture = [];
    this.searchTapControl(false);
  }
}

