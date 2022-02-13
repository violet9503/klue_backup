import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LectureEval } from '../object/lecture';
import {UserService} from '../user.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LectureService {
  private APIUrl = 'https://api.develope.klue.kr';
  searchOption : any;

  /*
  private modalChangeState = new Subject<string>();
  private appChangeLogin = new Subject<boolean>();
  changeState$ = this.modalChangeState.asObservable();
  changeLogin$ = this.appChangeLogin.asObservable();
  changeKeyword$ = this.lectureChangeKeyword.asObservable();

  stateChange(change: string, id?: number) {
    if(id)
      this.reportEvaluationId = id;
    this.modalChangeState.next(change);
  }

  loginChange(change: boolean){
    this.appChangeLogin.next(change);
  }

  keywordChange(change:string){
    this.lectureChangeKeyword.next(change);
  }
*/
  constructor(private http : Http, private userService: UserService){console.log('service start')}

  search(keyword:string, order:string, page?: number){
    let Url:string = `${this.APIUrl}/search/lectures?keyword=${keyword}&order=${order}`;

    if(page)
      Url += `&page=${page}`;

    if(this.searchOption){
      if(this.searchOption.year)
        Url += `&year=${this.searchOption.year}`;

      if(this.searchOption.term)
        Url += `&term=${this.searchOption.term}`;

      if(this.searchOption.category == "전공"){
        if(this.searchOption.college)
          Url += `&college=${this.searchOption.college}`;

        if(this.searchOption.department)
          Url += `&department=${this.searchOption.department}`;

      } else if(this.searchOption.category == "교양"){
        if(this.searchOption.college == "교양") {
          if(this.searchOption.department == "")
            Url += `&type=${this.searchOption.college}`
          else
            Url += `&department=${this.searchOption.department}`
        } else
          Url += `&type=${this.searchOption.college}`;
      }

      if(this.searchOption.sliderChange)
        Url += `&star_total=${this.searchOption.sliderOption[0]}&star_attendance=${this.searchOption.sliderOption[1]}&star_grade=${this.searchOption.sliderOption[2]}
                &star_difficulty=${this.searchOption.sliderOption[3]}&star_studytime=${this.searchOption.sliderOption[4]}&star_achievement=${this.searchOption.sliderOption[5]}`
    }

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  viewEval(id:string, page?:number){
    let Url:string;
    if(page){
      Url = `${this.APIUrl}/lectures/${id}/evaluation?count=5&page=${page}`;
    }else{
      Url = `${this.APIUrl}/lectures/${id}/evaluation?count=5`;
    }
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  viewLectureInfo(id:string){
    let Url = `${this.APIUrl}/lectures/${id}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  registerEval(id:string, lectureEval:LectureEval){
    let Url = `${this.APIUrl}/lectures/${id}/evaluation`;
    return this.http
      .post(Url, lectureEval, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  rewriteEval(id:string, lectureEval:LectureEval){
    let Url = `${this.APIUrl}/lectures/${id}/evaluation`;
    return this.http
      .put(Url, lectureEval, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  evalLike(id:number){
    let Url = `${this.APIUrl}/lectures/evaluation/${id}/like`;
    return this.http
      .post(Url, {}, { withCredentials: true })
      .catch(error => this.handleError(error));
  }

  writeCheck(id:number) {
    let Url = `${this.APIUrl}/lectures/${id}/check`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  registerComment(id:number, comment:string){
    let Url = `${this.APIUrl}/lectures/evaluation/${id}/comments`;
    return this.http
      .post(Url, {contents: comment}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  viewComment(id:number){
    let Url = `${this.APIUrl}/lectures/evaluation/${id}/comments`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  deleteComment(id:number, commentId:number){
    let Url = `${this.APIUrl}/lectures/evaluation/${id}/comments/${commentId}`;
    return this.http
      .delete(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  deleteEval(id:number){
    let Url = `${this.APIUrl}/lectures/${id}/evaluation`;
    return this.http
      .delete(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  evalLatest(){
    let Url = `${this.APIUrl}/lectures/evaluation`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getYear(){
    let Url: string = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}`

    return this.http
      .get(Url, {withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getCategory(year:string, term:string, category?: string, college?: string) {
    let Url: string;
    if (college)
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${year}&term=${term}&category=${category}&college=${college}`;
    else if (category)
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${year}&term=${term}&category=${category}`;
    else
      Url = `${this.APIUrl}/common/${this.userService.userInfo.sc_id}/college?year=${year}&term=${term}`;

    return this.http
      .get(Url, {withCredentials: true})
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
