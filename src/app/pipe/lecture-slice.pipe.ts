import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'lectureSlice'})
export class LectureSlicePipe implements PipeTransform {
  transform(name: string, limit: number): string {
    if(name.length > limit)
      return name.slice(0, limit).concat('⋯');
    else
      return name;
  }
}
