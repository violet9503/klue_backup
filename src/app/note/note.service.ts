import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {UserService} from '../user.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NoteService {
  private APIUrl = 'https://api.develope.klue.kr';
  noteInfo = {id:0, year:"", term:"", name:""};

  constructor(private http: Http, private userService: UserService) {}

  getLatestNote(){
    let Url = `${this.APIUrl}/notes`;
    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));

  }

  uploadNote(files: any){
    let Url = `${this.APIUrl}/notes`;

    console.log(files.getAll('hash_tag[]'));
    console.log(files.getAll('title'));

    return this.http
      .post(Url, files, { withCredentials: true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  searchLecture(keyword: string, year:string, term:string, count:number, page?:number){
    let Url = `${this.APIUrl}/search/notes/lecture?keyword=${keyword}&count=${count}`;

    if(year)
      Url += `&year=${year}`;

    if(term)
      Url += `&term=${term}`;

    if(page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  searchNoteKeyword(keyword: string, count:number, page?:number){
    let Url = `${this.APIUrl}/search/notes?keyword=${keyword}&count=${count}`;

    if(page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  searchNoteId(id: string, order: string, page?:number){
    let Url = `${this.APIUrl}/search/notes?lec_id=${id}&order=${order}&count=10`;

    if(page)
      Url += `&page=${page}`;

    return this.http
      .get(Url, { withCredentials: true })
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  getYear(){
    let Url:string = `https://api.develope.klue.kr/common/${this.userService.userInfo.sc_id}`

    return this.http
      .get(Url, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  viewNote(id:string){
    let Url:string = `https://api.develope.klue.kr/notes/${id}`

    return this.http
      .get(Url, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  noteLike(id:string){
    let Url = `${this.APIUrl}/notes/${id}/like`;
    return this.http
      .post(Url, {}, { withCredentials: true })
      .catch(error => this.handleError(error));
  }

  viewComment(id:string){
    let Url = `${this.APIUrl}/notes/${id}/comments`;

    return this.http
      .get(Url, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  registerComment(id:string, contents:string){
    let Url = `${this.APIUrl}/notes/${id}/comments`;

    return this.http
      .post(Url, {contents: contents}, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  deleteComment(noteId:string, commentId:number){
    let Url = `${this.APIUrl}/notes/${noteId}/comments/${commentId}`;

    return this.http
      .delete(Url, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  notePurchase(noteId:string){
    let Url = `${this.APIUrl}/notes/${noteId}/purchase`;

    return this.http
      .get(Url, {withCredentials:true})
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    if(error.status == 429)
      alert('?????? ????????? ?????? ?????? ????????? ???????????????. ?????? ?????? ?????? ??????????????????.');
    else
      alert('????????? ??????????????????. ?????? ?????? ?????? ??????????????????.');

    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errMsg);
  }
}
