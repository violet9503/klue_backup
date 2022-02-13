import { Component } from '@angular/core';

@Component({
  selector: 'lecture-result',
  template: `
    <sidemenu></sidemenu>
    <div class="lecture-index-wrap">
      <lecture-search></lecture-search>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./lecture-result.component.css']
})
export class LectureResultComponent {
}
