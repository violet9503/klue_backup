import {Component, OnInit, HostListener, Inject} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DOCUMENT} from '@angular/platform-browser';

import {NoteService} from '../note.service';

import {SharedService} from '../../shared-service';
import {RoutingService} from '../../routing.service';

import {Note} from '../../object/note';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit{
  private s3_url = "https://s3.ap-northeast-2.amazonaws.com/kluedata/note_thumbnail";
  order: string = "year_term";
  lec_id: string;
  page:number;
  notes:Note[];
  totalCount: number = 0;
  emptyNote: boolean = false;
  contentsLoading: boolean = false;

  constructor(private noteService:NoteService, private sharedService:SharedService, private routingService: RoutingService, private route:ActivatedRoute,
              @Inject(DOCUMENT) private document: Document){}

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.noteService.searchNoteId(params.get('id'), this.order))
      .subscribe(data => {
        console.log(data);
        this.lec_id = this.route.snapshot.params['id'];
        this.sharedService.keywordChange("");
        this.page = 2;
        this.totalCount = null;
        this.notes = null;
        if (data.data.length != 0) {
          this.emptyNote = false;
          this.totalCount = data.total_count;
          this.notes = data.data;

          this.notes.forEach(note => {
            console.log(note);
            if(note.profile){
              note.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+note.profile;
            }else
              note.profile = "/assets/img/Profile_Default.png";

          })

          console.log(this.notes);
        } else {
          this.emptyNote = true;
        }
      });
  }


  changeOrder(event){
    this.order = event.target.value;

    this.noteService.searchNoteId(this.lec_id, this.order)
      .subscribe(data => {
        this.page = 2;
        this.notes = null;
        if (data.data.length != 0) {
          this.notes = data.data;

          this.notes.forEach(note => {
            if(note.profile){
              note.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+note.profile;
            }else
              note.profile = "/assets/img/Profile_Default.png";
          })

          console.log(this.notes);
        } else {
          this.emptyNote = true;
        }
      });
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    let body = this.document.body;
    let number = this.document.documentElement ? this.document.documentElement.scrollTop : body.scrollTop;
    if ((number > body.scrollHeight - window.innerHeight - 200) && !this.contentsLoading) {
      if((this.totalCount - 1) / 10 >= this.page - 1){
        this.notesAppend();
        this.contentsLoading = true;
      }
    }
  }

  notesAppend(){
    this.noteService.searchNoteId(this.lec_id, this.order, this.page)
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
