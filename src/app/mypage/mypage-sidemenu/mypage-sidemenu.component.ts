import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {RoutingService} from '../../routing.service';
import {MypageService} from '../mypage.service';
import {Timetables, Term} from '../../object/timetable';

@Component({
  selector: 'mypage-sidemenu',
  templateUrl: './mypage-sidemenu.component.html',
  styleUrls: ['./mypage-sidemenu.component.css']
})

export class MypageSidemenuComponent implements OnChanges, OnDestroy {
  @Input() url: string;
  isMain: boolean;
  isTable: boolean;
  isCoffee: boolean;
  isHistory: boolean;
  isOpen: boolean = false;
  isOut: boolean = true;
  isRewrite:boolean;
  setName: string = "시간표";
  menuTitle: string;
  tableTerm: Term[] = [];
  timeTables: Timetables[] = [];
  tableName: string;
  savedObservable:any;

  constructor(private routingService: RoutingService, private mypageService: MypageService) {
    this.savedObservable = mypageService.requestTable$.subscribe(data => this.getTimetable());
  }

  ngOnChanges() {
    this.isMain = false;
    this.isTable = false;
    this.isCoffee = false;
    this.isHistory = false;

    if (this.url == '/mypage/coffeebean' || this.url == '/mypage/coffeecup') {
      this.menuTitle = "커피콩";
      this.isCoffee = true;
    } else if (this.url.indexOf("timetable") != -1) {
      this.menuTitle = "시간표";
      this.isTable = true;
      this.timeTables = [];
      this.loadTerm();
    } else if (this.url.indexOf("history") != -1) {
      this.menuTitle = "활동내역";
      this.isHistory = true;
    } else {
      this.menuTitle = "마이페이지";
      this.isMain = true;
    }
  }

  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }

  loadInput(input) {
    if (this.timeTables.length == 3) {
      alert('시간표는 3개 넘게 만들 수 없습니다.');
      return;
    }
    this.isRewrite = false;
    this.isOpen = true;
  }

  loadTerm() {
    this.tableTerm = [];
    this.mypageService.getTerm().subscribe(data => {
      for (let i = parseInt(data.timetable_year); i >= 2017; i--) {
        for (let j = parseInt(data.timetable_term); j >= 1; j--) {
          let temp = {year: i.toString(), term: j + "학기", val: i * 10 + j};
          this.tableTerm.push(temp);
        }
      }
    });
  }

  appendTable(name) {
    if(this.isRewrite){
      if(name.value == this.tableName){
        alert("현재 시간표 이름과 같습니다.");
        return;
      }
      this.mypageService.nameRewrite(name.value);
    }else{
      this.mypageService.makeTable(name.value).subscribe(data => {
        if (data.code == 200) {
          this.routingService.routingRefresh('mypage/timetable', data.timetable_id.toString());
        } else if (data.code == 60204) {
          alert('시간표는 3개 넘게 만들 수 없습니다.');
        } else
          console.log("makeTable Error" + data.code);
      });
    }
    this.setName = "시간표";
    this.isOpen = false;
  }

  getTimetable() {
    this.mypageService.getTables().subscribe(data => {
      console.log(data);
      if (data.code == 200) {
        if (data.data) {
          data.data.forEach(timetable => {
            this.timeTables.push(timetable)
            if (this.url.split('/')[3] == timetable.id)
              this.tableName = timetable.name;
            this.mypageService.tableName = this.tableName;
          });
          console.log(this.timeTables);
        }
      } else {
        console.log("getTables Error" + data.code);
      }
    })
  }

  selectChange(value: string) {
    this.mypageService.year = value.slice(0, 4);
    this.mypageService.term = (parseInt(value) % 10)+"학기";

    this.mypageService.getTables().subscribe(data => {
      if (data.code == 200) {
        if (data.data.length == 0)
          this.routingService.routingRefresh('mypage/timetable', '0');
        else
          this.routingService.routingRefresh('mypage/timetable', data.data[0].id.toString());

      } else {
        console.log("getTables Error" + data.code);
      }
    })
  }

  tableDelete() {
    let id = this.url.split("/")[3];
    let deleteConfirm = confirm("정말로 시간표를 삭제하시겠습니까?");

    if (deleteConfirm) {
      this.mypageService.deleteTable(id).subscribe(data => {
        console.log(data);
        if (data.code == 200) {
          alert('시간표 삭제가 완료되었습니다.');
          if (this.timeTables.length == 1)
            this.routingService.routingRefresh('mypage/timetable', '0');
          else {
            this.mypageService.getTables().subscribe(data => {
              if (data.code == 200 && data.data)
                this.routingService.routingRefresh('mypage/timetable', data.data[0].id.toString());
              else
                console.log("getTables Error" + data.code);
            })
          }
        } else {
          alert('오류가 발생하였습니다. 잠시 뒤 재시도 해주세요.');
          console.log(data);
        }
      })
    }
  }

  nameRewrite(){
    if (this.timeTables.length == 0) {
      alert('수정할 시간표가 존재하지 않습니다.');
      return;
    }
    this.setName = this.tableName;
    this.isRewrite = true;
    this.isOpen = true;
  }

  modalOut() {
    if (this.isOut)
      this.isOpen = false;
  }
}
