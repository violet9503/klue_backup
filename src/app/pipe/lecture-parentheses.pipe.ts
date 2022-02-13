import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'lectureParentheses'})
export class LectureParenthesesPipe implements PipeTransform {
  transform(count: number): string {
    if(eval){
      return `(${count})`;
    }else
      return null;
  }
}
