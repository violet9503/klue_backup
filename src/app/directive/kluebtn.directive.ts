import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router }  from '@angular/router';

@Directive({
  selector: '[klueBtn]'
})
export class KluebtnDirective {
  @Input('klueBtn') imgSrc: string;
  private originSrc: string;

  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.style.cursor = 'pointer';
  }
  @HostListener('mouseenter', ['$event'])
  btnEnter() {
    this.el.nativeElement.style.color = '#ffffff';
    this.el.nativeElement.style.backgroundColor = '#fd884d';
    if(this.imgSrc){
      this.originSrc = this.el.nativeElement.children[0].src;
      this.el.nativeElement.children[0].src = `/assets/img/${this.imgSrc}.png`;
    }
  }

  @HostListener('mouseleave', ['$event'])
  btnLeave() {
    this.el.nativeElement.style.color = '';
    this.el.nativeElement.style.backgroundColor = '';
    if(this.originSrc){
      this.el.nativeElement.children[0].src = this.originSrc;
      this.originSrc = null;
    }
  }

  @HostListener('click', ['$event'])
  btnClick() {
    this.el.nativeElement.disabled = true;
    this.el.nativeElement.style.backgroundColor = '';
    this.el.nativeElement.style.color = '#bbbbbb';
    this.el.nativeElement.style.border = '1px solid #bbbbbb';

    setTimeout(()=>{
      this.el.nativeElement.disabled = false;
      this.el.nativeElement.style.color = '';
      this.el.nativeElement.style.border = '';
      if(this.originSrc){
        this.el.nativeElement.children[0].src = this.originSrc;
        this.originSrc = null;
      }
    }, 500)
  }
}
