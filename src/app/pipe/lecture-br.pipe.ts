import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'lectureBr'})
export class LectureBrPipe implements PipeTransform {
  transform(contents: string): string {
    let result = contents.replace(/\n/g, "<br>");
    return result;
  }
}
