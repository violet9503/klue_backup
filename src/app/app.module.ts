import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared.module';

import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {FooterComponent} from './footer/footer.component';
import {PageNotFoundComponent} from './not-found.component';

import {ModalComponent} from './modal/modal.component';
import {ModalHeaderComponent} from './modal/modal-header/modal-header.component';
import {ModalContentsComponent} from './modal/modal-contents.component';
import {ModalFooterComponent} from './modal/modal-footer/modal-footer.component';
import {ModalLoginComponent} from './modal/modal-login/modal-login.component';
import {ModalSignupComponent} from './modal/modal-signup/modal-signup.component';
import {ModalLossComponent} from './modal/modal-loss/modal-loss.component';
import {ModalCompleteComponent} from './modal/modal-signup/modal-complete.component';
import {ModalConfirmComponent} from './modal/modal-signup/modal-confirm.component';
import {ModalReportComponent} from './modal/modal-report/modal-report.component';
import {ModalChargeComponent} from './modal/modal-charge/modal-charge.component';
import {ModalNicknameComponent} from './modal/modal-first/modal-nickname.component';
import {ModalCheckComponent} from './modal/modal-check/modal-check.component';
import {ModalAuthComponent} from './modal/modal-first/modal-auth.component';
import {ModalCloseComponent} from './modal/modal-close.component';

import {MenubarComponent} from './menubar/menubar.component';
import {MenubarSearchComponent} from './menubar/menubar-search.component';
import {MenubarUserComponent} from './menubar/menubar-user.component';
import {MenubarGuestComponent} from './menubar/menubar-guest.component';
import {AlarmComponent} from './menubar/alarm.component';

import {FooterViewComponent} from './footer/footer-view/footer-view.component';
import {FooterHeaderComponent} from './footer/footer-header/footer-header.component';
import {FooterServiceComponent} from './footer/footer-content/footer-service.component';
import {FooterPrivacyComponent} from './footer/footer-content/footer-privacy.component';

import {ResetPasswordComponent} from './reset-password.component';
import { DummyComponent} from './dummy.component';

import {UserService} from './user.service';
import {AuthGuard} from './auth-guard.service';
import {SharedService} from './shared-service';
import {RoutingService} from './routing.service';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    FooterComponent,
    PageNotFoundComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalContentsComponent,
    ModalFooterComponent,
    ModalLoginComponent,
    ModalSignupComponent,
    ModalLossComponent,
    ModalCompleteComponent,
    ModalConfirmComponent,
    ModalChargeComponent,
    ModalCloseComponent,
    ModalNicknameComponent,
    ModalCheckComponent,
    ModalAuthComponent,
    ModalReportComponent,
    MenubarComponent,
    MenubarSearchComponent,
    MenubarUserComponent,
    MenubarGuestComponent,
    AlarmComponent,
    FooterViewComponent,
    FooterHeaderComponent,
    FooterServiceComponent,
    FooterPrivacyComponent,
    ResetPasswordComponent,
    DummyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    UserService,
    AuthGuard,
    SharedService,
    RoutingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
