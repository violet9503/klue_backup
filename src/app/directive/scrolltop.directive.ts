import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router }  from '@angular/router';

@Directive({
  selector: '[scrollTop]'
})
export class ScrolltopDirective {
  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.style.cursor = 'pointer';
    el.nativeElement.style.width = '40px';
    el.nativeElement.style.height = '63px';
    el.nativeElement.style.position = 'fixed';
    el.nativeElement.style.bottom = '30px';
    el.nativeElement.style.right = '40px';
  }
  @HostListener('click', ['$event'])
  onClick(e) {
    window.scrollTo(0, 0)
  }
}
