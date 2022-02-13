import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {SharedService} from './shared-service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private sharedService: SharedService, private router: Router, private http: Http) {
  }

  subject = new Subject<any>();

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let url: string = state.url;

    return Observable.create((observer: Subject<boolean>) => {
      this.userService.isLogin().subscribe(data => {
        if (data.code == 200) {
          this.sharedService.loginChange(true);
          observer.next(true);
        } else {
          alert('로그인 후 이용해주세요.');
          this.sharedService.loginChange(false);
          this.sharedService.stateChange('login');
          observer.next(false);
        }
        observer.complete();
      })
    });
  }
}
