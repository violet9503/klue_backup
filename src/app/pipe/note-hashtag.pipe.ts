import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'noteHashtag'})
export class NoteHashtagPipe implements PipeTransform {
  transform(contents: string): string {
    let result = "#"+contents.replace(/\[/g, "").replace(/\]/g, "");
    return result;
  }
}
