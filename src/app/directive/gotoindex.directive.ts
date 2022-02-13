import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router }  from '@angular/router';

@Directive({
  selector: '[gotoIndex]'
})
export class GotoIndexDirective {
  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.style.cursor = 'pointer';
  }
  @HostListener('click', ['$event'])
  onClick(e) {
    if(this.router.url == "/")
      window.location.reload();
    else
      this.router.navigate(['/']);
  }
}
