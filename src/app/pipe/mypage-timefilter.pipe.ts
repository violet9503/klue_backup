import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mypageTimefilter'})
export class MypageTimefilterPipe implements PipeTransform {
  transform(time: string[]): string {
    let tempTime:string[] = ["", "", "", "", ""];
    let result: string = "";
    for(let i = 0; i<time.length; i++){
      switch(time[i].slice(0, 1)){
        case "월": tempTime[0] += ", "+time[i].slice(1, 2); break;
        case "화": tempTime[1] += ", "+time[i].slice(1, 2); break;
        case "수": tempTime[2] += ", "+time[i].slice(1, 2); break;
        case "목": tempTime[3] += ", "+time[i].slice(1, 2); break;
        case "금": tempTime[4] += ", "+time[i].slice(1, 2); break;
      }
    }
    for(let i=0; i<tempTime.length; i++){
      if(tempTime[i].length != 0){
        switch(i){
          case 0: result += "월 " + tempTime[0].slice(2); break;
          case 1: result += "화 " + tempTime[1].slice(2); break;
          case 2: result += "수 " + tempTime[2].slice(2); break;
          case 3: result += "목 " + tempTime[3].slice(2); break;
          case 4: result += "금 " + tempTime[4].slice(2); break;
        }
        result += " / ";
      }
    }

    return result.slice(0, -3);
  }
}
