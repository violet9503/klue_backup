import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { IndexComponent } from './index/index.component';
import { AlarmComponent} from './menubar/alarm.component';
import { PageNotFoundComponent }    from './not-found.component';
import { ResetPasswordComponent} from './reset-password.component';
import { FooterViewComponent} from './footer/footer-view/footer-view.component';
import { FooterServiceComponent} from './footer/footer-content/footer-service.component';
import { FooterPrivacyComponent} from './footer/footer-content/footer-privacy.component';
import { DummyComponent} from './dummy.component';

import { AuthGuard } from './auth-guard.service';


const appRoutes: Routes = [
  { path: 'lecture', loadChildren: './lecture/lecture.module#LectureModule'},
  { path: 'mypage', loadChildren: './mypage/mypage.module#MypageModule'},
  { path: 'note', loadChildren: './note/note.module#NoteModule'},
  { path: 'policy', component: FooterViewComponent,
  children: [
    {
      path: 'privacy',
      component: FooterPrivacyComponent
    },
    {
      path: 'service',
      component: FooterServiceComponent
    },
    {
      path: 'pay',
      component: FooterServiceComponent
    }
  ]},
  { path: 'alarm', component: AlarmComponent, canActivate: [AuthGuard]},
  { path: 'notfound', component: PageNotFoundComponent},
  { path: 'resetPassword/:token', component: ResetPasswordComponent},
  { path: 'dummy', component:DummyComponent},
  { path: '',   component: IndexComponent, pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
      //{ enableTracing: true } // <-- debugging purposes only                  ,  canActivate: [AuthGuard]
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
