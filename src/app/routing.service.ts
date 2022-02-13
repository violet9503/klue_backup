import {Injectable} from '@angular/core';
import {Router} from '@angular/router'

@Injectable()
export class RoutingService {
  constructor(private router:Router){}
  routing(firstRoute:string, secondRoute?){
    if(secondRoute){
      this.router.navigate([firstRoute, secondRoute]);
    }else{
      this.router.navigate([firstRoute]);
    }
  }

  routingRefresh(firstRoute:string, secondRoute?){
    this.router.navigateByUrl('/dummy', { skipLocationChange: true })
    setTimeout(()=> {
      if(secondRoute){
        this.router.navigate([firstRoute, secondRoute]);
      }else{
        this.router.navigate([firstRoute]);
      }
    })
  }
}
