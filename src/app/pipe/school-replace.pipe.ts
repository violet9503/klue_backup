import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'schoolReplace'})
export class SchoolReplacePipe implements PipeTransform {
  transform(name: string, toEmail?:boolean): string {
    if(toEmail){
      if(name == "ku")
        return "@korea.ac.kr";
      else if(name == "ku_sejong")
        return "@korea.ac.kr";
      else
        return ""
    }else{
      if(name == "ku")
        return "고려대학교";
      else if(name == "ku_sejong")
        return "고려대학교(세종)";
      else
        return ""
    }
  }
}
