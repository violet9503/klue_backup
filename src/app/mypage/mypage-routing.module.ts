import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MypageComponent }   from './mypage.component';
import { MypageProfileComponent} from './mypage-profile/mypage-profile.component';
import { MypageAccountComponent} from './mypage-account/mypage-account.component';
import { MypagePasswordComponent} from './mypage-password/mypage-password.component';
import { MypageCoffeebeanComponent} from './mypage-coffeebean/mypage-coffeebean.component';
import { MypageCoffeecupComponent} from './mypage-coffeebean/mypage-coffeecup.component';
import { MypageTimetableComponent} from './mypage-timetable/mypage-timetable.component';
import { MypageEvalComponent} from './mypage-history/mypage-eval.component';
import { MypageNoteComponent} from './mypage-history/mypage-note.component';
import { MypagePointComponent} from './mypage-history/mypage-point.component';
import { MypageReportComponent} from './mypage-history/mypage-report.component';

import { AuthGuard } from '../auth-guard.service';
import { AccountGuard } from './account-guard.service';
import { MypageService} from './mypage.service';

const mypageRoutes: Routes = [
  {
    path: '',
    component: MypageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MypageProfileComponent
      },
      {
        path: 'account',
        component: MypageAccountComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'password',
        component: MypagePasswordComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'coffeebean',
        component:MypageCoffeebeanComponent
      },
      {
        path: 'coffeecup',
        component:MypageCoffeecupComponent
      },
      {
        path: 'timetable/:id',
        component:MypageTimetableComponent
      },
      {
        path: 'history/eval',
        component:MypageEvalComponent
      },
      {
        path: 'history/note',
        component:MypageNoteComponent
      },
      {
        path: 'history/point',
        component:MypagePointComponent
      },
      {
        path: 'history/report',
        component:MypageReportComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mypageRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [MypageService]
})
export class MypageRoutingModule {}
