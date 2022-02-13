import {Component} from '@angular/core';

@Component({
  selector: 'note-result',
  template: `
    <sidemenu></sidemenu>
    <div class="note-index-wrap">
        <note-search></note-search>
        <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./note-result.component.css']
})
export class NoteResultComponent {
}
