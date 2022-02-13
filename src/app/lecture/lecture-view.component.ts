import { Component } from '@angular/core';

@Component({
  selector: 'lecture-view',
  template: `
    <sidemenu></sidemenu>
    <div class="lecture-index-wrap">
      <lecture-info></lecture-info>
      <lecture-eval></lecture-eval>
    </div>
  `,
  styleUrls: ['./lecture-result.component.css']
})
export class LectureViewComponent { }
