import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { SharedModule} from '../shared.module';

import { LectureResultComponent }   from './lecture-result.component';
import { LectureViewComponent }   from './lecture-view.component';
import { LectureSearchComponent }   from './lecture-search/lecture-search.component';
import { LectureListComponent }   from './lecture-list/lecture-list.component';
import { LectureEvalComponent }   from './lecture-eval/lecture-eval.component';
import { LectureLatestComponent } from './lecture-eval/lecture-latest.component';
import { LectureInfoComponent }   from './lecture-info/lecture-info.component';
import { LectureWriteComponent }   from './lecture-write/lecture-write.component';

import { LectureRoutingModule }       from './lecture-routing.module';

import { NouisliderDirective } from './lecture-search/nouislider-directive';
import { NouisliderModule } from 'ng2-nouislider';


@NgModule({
  imports: [
    CommonModule,
    LectureRoutingModule,
    SharedModule,
    NouisliderModule
  ],
  declarations: [
    LectureResultComponent,
    LectureViewComponent,
    LectureSearchComponent,
    LectureListComponent,
    LectureEvalComponent,
    LectureInfoComponent,
    LectureWriteComponent,
    LectureLatestComponent,
    NouisliderDirective
  ]
})

export class LectureModule {}
