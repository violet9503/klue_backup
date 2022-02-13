import {Component, OnInit} from '@angular/core';

import {NoteService} from '../note.service';
import {RoutingService} from '../../routing.service';

import {Note} from '../../object/note';

@Component({
  selector: 'note-latest',
  templateUrl: './note-latest.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteLatestComponent implements OnInit{
  notes:Note[];
  private s3_url = "https://s3.ap-northeast-2.amazonaws.com/kluedata/note_thumbnail";

  constructor(private noteService: NoteService, private routingService: RoutingService){}

  ngOnInit(){
    this.noteService.getLatestNote().subscribe(data => {
      console.log(data);
      if(data.total_count != 0){
        this.notes = data.data;

        this.notes.forEach(note => {
          if(note.profile){
            note.profile = "https://s3.ap-northeast-2.amazonaws.com/kluedata/profile/medium/"+note.profile;
          }else
            note.profile = "/assets/img/Profile_Default.png";
        })

      }
    })
  }



  clickNoteView(state:number, id:number){
    if(state != 0)
      this.routingService.routing('note', id);
  }
}
