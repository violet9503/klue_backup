import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserSignup} from './object/user-signup';
import {UserInfo} from './object/user-info';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  redirectUrl: string;
  private APIUrl = 'https://api.develope.klue.kr';
  userInfo:UserInfo;

  constructor(private http: Http) {
  }

  userLogin(id: string, password: string, name?:string) {
    let Url = `${this.APIUrl}/login`;
    if(name){
      return this.http
        .post(Url, {id: id, password: password, name:name}, { withCredentials: true })
        .map(response => response.json())
        .catch(error => this.handleError(error));
    }else{
      return this.http
        .post(Url, {id: id, password: password}, { withCredentials: true })
        .map(response => response.json())
        .catch(error => this.handleError(error));
    }
  }

  adminLogin(){
    let Url = `${this.APIUrl}/test/login`;
    return this.http
      .get(Url, { withCredentials: true });
  }

  isLogin() {
    let Url = `${this.APIUrl}/info`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  logout() {
    let Url = `${this.APIUrl}/logout`;

    return this.http
      .post(Url, {}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  userIdCheck(id: string) {
    let Url = `${this.APIUrl}/exist?id=${id}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  nameCheck(name: string, oldUser?: string) {
    let Url = `${this.APIUrl}/exist?name=${name}`;
    if(oldUser)
      Url += `&except=${oldUser}`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  emailCheck(sc_id: string, sc_email: string) {
    let Url = `${this.APIUrl}/exist?sc_id=${sc_id}&sc_email=${sc_email}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  signUp(user: UserSignup) {
    console.log(user);
    let Url = `${this.APIUrl}/register`;
    return this.http
      .post(Url, user, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  unRegister() {
    let Url = `${this.APIUrl}/unRegister`;
    return this.http
      .post(Url, {}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getFacebookToken(token) {
    let Url = `${this.APIUrl}/socialLogin/facebook/login?access_token=${token}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }


  getGoogleToken(token) {
    let Url = `${this.APIUrl}/socialLogin/google/login?access_token=${token}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  signUpSNS(user, flag){
    let Url = `${this.APIUrl}/socialLogin/${flag}/register?access_token=${user.access_token}&name=${user.name}&sc_id=${user.sc_id}&sc_email=${user.sc_email}`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getAlarmList(count:number, page?:number){
    let Url:string;
    if(!page)
      Url = `${this.APIUrl}/alarm/list?count=${count}`;
    else
      Url = `${this.APIUrl}/alarm/list?count=${count}&page=${page}`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getAlarmStatus(){
    let Url:string = `${this.APIUrl}/alarm`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  evalReport(id:number, contents:string){
    let Url = `${this.APIUrl}/lectures/evaluation/${id}/accusation`;
    return this.http.post(Url, {contents: contents}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  findId(sc_id:string, sc_email:string){
    let Url = `${this.APIUrl}/findId?sc_id=${sc_id}&sc_email=${sc_email}`;
    return this.http.get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  findPw(id:string){
    let Url = `${this.APIUrl}/resetPassword?id=${id}`;
    return this.http.get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  resetPw(token:string, pw:string){
    let Url = `${this.APIUrl}/resetPassword/${token}`;
    return this.http.post(Url, {password: pw}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getIndexImg(){
    let Url = `${this.APIUrl}/common`;
    return this.http.get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getReadAuth(){
    let Url = `${this.APIUrl}/common/${this.userInfo.sc_id}/read-eval`;
    return this.http.post(Url, {}, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  checkPw(pw:string){
    let Url = `${this.APIUrl}/checkPassword?password=${pw}`;
    return this.http.get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  loadClause(state?:string){
    let Url: string;
    if(state=="privacy"){
      Url = `${this.APIUrl}/common/clause/info`;
    }else{
      Url = `${this.APIUrl}/common/clause`;
    }
    return this.http.get(Url, { withCredentials: true })
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    if(error.status == 429)
      alert('짧은 시간에 너무 많은 시도를 하셨습니다. 잠시 후에 다시 시도해주세요.');
    else
      alert('에러가 발생했습니다. 잠시 후에 다시 시도해주세요.');

    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errMsg);
  }
}
