import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router }  from '@angular/router';

@Directive({
  selector: '[refresh]'
})
export class RefreshDirective {
  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.style.cursor = 'pointer';
  }
  @HostListener('click', ['$event'])
  onClick(e) {
    window.location.reload();
  }
}
