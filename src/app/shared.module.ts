import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LectureReviewComponent} from './lecture/lecture-eval/lecture-review.component';
import {NoteReviewComponent} from './note/note-review/note-review.component';
import {SidemenuComponent} from './sidemenu/sidemenu.component';

import {GotoIndexDirective} from './directive/gotoindex.directive';
import {RefreshDirective} from './directive/refresh.directive';
import {KluebtnDirective} from './directive/kluebtn.directive';
import {ScrolltopDirective} from './directive/scrolltop.directive';

import {SchoolReplacePipe} from './pipe/school-replace.pipe';
import {LectureTimelocationPipe} from './pipe/lecture-timelocation.pipe';
import {LectureBrPipe} from './pipe/lecture-br.pipe';
import {LectureParenthesesPipe} from './pipe/lecture-parentheses.pipe';
import {LectureSlicePipe} from './pipe/lecture-slice.pipe';
import { MypageTimelocationPipe } from './pipe/mypage-timelocation.pipe';
import { MypageTimefilterPipe } from './pipe/mypage-timefilter.pipe';
import { NoteHashtagPipe } from './pipe/note-hashtag.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LectureReviewComponent,
    NoteReviewComponent,
    SidemenuComponent,
    GotoIndexDirective,
    RefreshDirective,
    KluebtnDirective,
    ScrolltopDirective,
    SchoolReplacePipe,
    LectureTimelocationPipe,
    LectureBrPipe,
    LectureParenthesesPipe,
    LectureSlicePipe,
    MypageTimelocationPipe,
    MypageTimefilterPipe,
    NoteHashtagPipe
  ],
  exports: [
    LectureReviewComponent,
    NoteReviewComponent,
    SidemenuComponent,
    GotoIndexDirective,
    RefreshDirective,
    KluebtnDirective,
    ScrolltopDirective,
    SchoolReplacePipe,
    LectureTimelocationPipe,
    LectureBrPipe,
    LectureParenthesesPipe,
    LectureSlicePipe,
    MypageTimelocationPipe,
    MypageTimefilterPipe,
    NoteHashtagPipe
  ]
})
export class SharedModule {
}
