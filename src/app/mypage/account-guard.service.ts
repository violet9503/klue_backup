import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {SharedService} from '../shared-service';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private sharedService: SharedService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.sharedService.accountCheck) { return true; }

    alert('올바르지 않은 접근입니다.');
    this.router.navigate(['/']);

    return false;
  }
}
