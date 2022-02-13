import {Component, Directive, EventEmitter, OnInit, OnDestroy, Output, Self, ElementRef} from '@angular/core';
import {NouisliderComponent} from 'ng2-nouislider';

@Directive({selector: '[slider-selected]'})
export class NouisliderDirective implements OnInit, OnDestroy {
  @Output() public selected: EventEmitter<any> = new EventEmitter(true);

  public minV: any;
  public maxV: any;

  constructor(@Self() private sliderRef: NouisliderComponent,
              private ell: ElementRef) {
  }

  ngOnInit(): void {
    var that = this;
    this.sliderRef.slider.on('change', (values: string[], handle: number, unencoded: number[]) => {
      that.rangeChange(handle, values);
    });
  }

  ngAfterViewInit(): void {
    let div: Element = this.ell.nativeElement.parentElement.parentElement;
    this.minV = div.querySelector("[minValue]");
    this.maxV = div.querySelector("[maxValue]");
  }

  ngOnDestroy(): void {
  }

  rangeChange(_handle, _values) {
    if (_handle == 0) {
      this.minV.innerHTML = _values[0];
    }
    else if (_handle == 1) {
      this.maxV.innerHTML = _values[1];
    }
  }
}
