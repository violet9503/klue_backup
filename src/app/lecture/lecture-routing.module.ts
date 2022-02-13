import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LectureResultComponent }   from './lecture-result.component';
import { LectureViewComponent }   from './lecture-view.component';
import { LectureWriteComponent } from './lecture-write/lecture-write.component';
import { LectureListComponent} from './lecture-list/lecture-list.component';
import { LectureLatestComponent} from './lecture-eval/lecture-latest.component'

import { AuthGuard } from '../auth-guard.service';
import { LectureService } from './lecture.service';

const lectureRoutes: Routes = [
  {
    path: '',
    component: LectureResultComponent,
    children: [
      {
        path: 'search/:keyword',
        component: LectureListComponent
      },
      {
        path: 'latest',
        component: LectureLatestComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: ':id',
    component: LectureViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'write/:id',
    component: LectureWriteComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(lectureRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [LectureService]
})
export class LectureRoutingModule {}
