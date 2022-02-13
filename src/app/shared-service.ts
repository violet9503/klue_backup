import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Evaluation} from './object/evaluation';

@Injectable()
export class SharedService {
  private modalChangeState = new Subject<string>();
  private appChangeLogin = new Subject<boolean>();
  private lectureChangeKeyword = new Subject<string>();
  changeState$ = this.modalChangeState.asObservable();
  changeLogin$ = this.appChangeLogin.asObservable();
  changeKeyword$ = this.lectureChangeKeyword.asObservable();

  reportEvaluationId:number;
  oldUserLoginInfo = {id:"", password:"", name:""};
  accountCheck:boolean = false;
  savedEval:Evaluation = null;

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
}
