import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared.module';

import {MypageComponent} from './mypage.component';
import {MypageHeaderComponent} from './mypage-header/mypage-header.component';
import {MypageProfileComponent} from './mypage-profile/mypage-profile.component';
import {MypageSidemenuComponent} from './mypage-sidemenu/mypage-sidemenu.component';
import { MypageAccountComponent} from './mypage-account/mypage-account.component';
import { MypagePasswordComponent} from './mypage-password/mypage-password.component';
import { MypageCoffeebeanComponent} from './mypage-coffeebean/mypage-coffeebean.component';
import { MypageCalendarComponent}  from './mypage-coffeebean/mypage-calendar.component';
import { MypageCoffeecupComponent} from './mypage-coffeebean/mypage-coffeecup.component';
import { MypageTimetableComponent} from './mypage-timetable/mypage-timetable.component';
import { MypageEvalComponent} from './mypage-history/mypage-eval.component';
import { MypageNoteComponent} from './mypage-history/mypage-note.component';
import { MypagePointComponent} from './mypage-history/mypage-point.component';
import { MypageReportComponent} from './mypage-history/mypage-report.component';

import {ImageCropperComponent} from 'ng2-img-cropper';

import {MypageRoutingModule} from './mypage-routing.module';

import { AccountGuard } from './account-guard.service';

@NgModule({
  imports: [
    CommonModule,
    MypageRoutingModule,
    SharedModule
  ],
  declarations: [
    MypageComponent,
    MypageHeaderComponent,
    MypageProfileComponent,
    MypageSidemenuComponent,
    MypageAccountComponent,
    MypagePasswordComponent,
    MypageCoffeebeanComponent,
    MypageCalendarComponent,
    MypageCoffeecupComponent,
    MypageTimetableComponent,
    MypageEvalComponent,
    MypageNoteComponent,
    MypagePointComponent,
    MypageReportComponent,

    ImageCropperComponent
  ],
  providers: [AccountGuard]
})
export class MypageModule {
}
