import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {UserService} from '../user.service';

import {MypageInfo} from '../object/user-info';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MypageService {

  private APIUrl = 'https://api.develope.klue.kr';
  private tableImgReq = new Subject<string>();
  private tableNameReq = new Subject<string>();
  private tableListReq = new Subject<boolean>();
  tableName: string;
  year: string;
  term: string;
  userInfo: MypageInfo = {
    id: "", sc_id: "", sc_email: "", phone_number: "", coffee_bean: 0, points: 0, evaluation_count: 0, note_count: 0,
    purchase_note_count: 0, facebook: "", google: "", name: "", read_lec_eval_authority: false
  };

  requestTable$ = this.tableListReq.asObservable();
  requestImg$ = this.tableImgReq.asObservable();
  requestRewrite$ = this.tableNameReq.asObservable();

  constructor(private http: Http, private userService: UserService) {
    this.getTerm().subscribe(data => {
      this.year = data.timetable_year;
      this.term = data.timetable_term;
    })

    this.getInfo().subscribe(data => this.userInfo = data.data)
  }

  imgRequest(name: string) {
    this.tableImgReq.next(name);
  }

  nameRewrite(name: string) {
    this.tableNameReq.next(name);
  }

  tableRequest(state: boolean) {
    this.tableListReq.next(state);
  }

  getInfo() {
    let Url: string = `https://api.develope.klue.kr/info/mypage`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getTerm() {
    let Url: string = `https://api.develope.klue.kr/common/${this.userService.userInfo.sc_id}`

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getTables() {
    let Url = `${this.APIUrl}/timetable?year=${this.year}&term=${this.term}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getTable(id: string) {
    let Url = `${this.APIUrl}/timetable/${id}`;
    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  makeTable(name: string) {
    let Url = `${this.APIUrl}/timetable`;

    return this.http
      .post(Url, {year: this.year, term: this.term, name: name}, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  deleteTable(id: string) {
    let Url = `${this.APIUrl}/timetable/${id}`;

    return this.http
      .delete(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }


  search(keyword: string, filter: string, page?: number) {
    let Url: string;
    if (filter == "0") {
      console.log(keyword);
      console.log(this.year, this.term);
      if (page) {
        Url = `${this.APIUrl}/search/lectures/timetable?keyword=${keyword}&year=${this.year}&term=${this.term}&page=${page}`;
      } else {
        Url = `${this.APIUrl}/search/lectures/timetable?keyword=${keyword}&year=${this.year}&term=${this.term}`;
      }
    } else {
      if (page) {
        Url = `${this.APIUrl}/search/lectures/timetable?keyword=${keyword}&year=${this.year}&term=${this.term}&page=${page}&timetable_id=${filter}`;
      } else {
        Url = `${this.APIUrl}/search/lectures/timetable?keyword=${keyword}&year=${this.year}&term=${this.term}&timetable_id=${filter}`;
      }
    }

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  putTable(id: string, lecture: number[], name?: string) {
    let Url = `${this.APIUrl}/timetable/${id}`;
    if (name) {
      return this.http
        .put(Url, {name: name, lectures: lecture}, {withCredentials: true})
        .map(response => response.json())
        .catch(error => this.handleError(error));
    } else {
      return this.http
        .put(Url, {lectures: lecture}, {withCredentials: true})
        .map(response => response.json())
        .catch(error => this.handleError(error));
    }
  }

  getCategory(category?: string, college?: string) {
    let Url: string;
    if (college)
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${this.year}&term=${this.term}&category=${category}&college=${college}`;
    else if (category)
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${this.year}&term=${this.term}&category=${category}`;
    else
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${this.year}&term=${this.term}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  filterSearch(filter: string, type: string, college: string, department: string, page?: number) {
    let Url: string;

    if (type)
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&type=${type}`;
    else if (department)
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&college=${college}&department=${department}`;
    else
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&college=${college}`;

    if (page)
      Url += `&page=${page}`;

    if (filter != "0")
      Url += `&timetable_id=${filter}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));

  }

  filterSearchWithTime(time: string[], condition: boolean, type: string, college: string, department: string, page?: number) {
    let Url: string;

    if (type)
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&type=${type}`;
    else if (department)
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&college=${college}&department=${department}`;
    else
      Url = `${this.APIUrl}/search/lectures/timetable?year=${this.year}&term=${this.term}&college=${college}`;

    if (page)
      Url += `&page=${page}`;

    if (condition) {
      for (let i = 0; i < time.length; i++) {
        Url += `&time_list_only[]=${time[i]}`
      }
    }
    else {
      for (let i = 0; i < time.length; i++) {
        Url += `&time_list_include[]=${time[i]}`
      }
    }

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));

  }

  setProfile(profile: any) {
    let Url = `${this.APIUrl}/info/profile`;

    return this.http
      .post(Url, profile, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  deleteProfile() {
    let Url = `${this.APIUrl}/info/profile`;

    return this.http
      .delete(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  connectSNS(flag, token) {
    let Url = `${this.APIUrl}/socialLogin/${flag}/connect?access_token=${token}`;
    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getMyEval() {
    let Url = `${this.APIUrl}/activity/evaluation`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }


  getUploadNote(page?: number) {
    let Url = `${this.APIUrl}/activity/note/uploaded`;

    if (page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }


  getDownNote(page?: number) {
    let Url = `${this.APIUrl}/activity/note/purchased`;

    if (page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getMyPoint(page?: number) {
    let Url = `${this.APIUrl}/activity/points?count=10`;

    if (page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  updatePw(oldPw:string, newPw:string){
    let Url = `${this.APIUrl}/updatePassword`;

    return this.http
      .put(Url, {current_password:oldPw, new_password:newPw}, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    if (error.status == 429)
      alert('짧은 시간에 너무 많은 시도를 하셨습니다. 잠시 후에 다시 시도해주세요.');
    else
      alert('에러가 발생했습니다. 잠시 후에 다시 시도해주세요.');

    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errMsg);
  }
}
