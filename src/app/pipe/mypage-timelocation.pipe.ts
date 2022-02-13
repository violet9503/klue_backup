import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mypageTimeLocation'})
export class MypageTimelocationPipe implements PipeTransform {
  transform(time: string, location: string): string {
    let result: string = "";
    if(time){
      let time_split = time.replace(/"|]/g, "").replace("[", " ").split(",");
      if(location){
        let location_split = location.replace(/"|]/g, "").replace("[", " ").split(",");
        for(let i=0; i<time_split.length; i++){
          result += time_split[i] + location_split[i] + "<br>";
        }
        result = result.slice(0, -4);
      }else{
        for(let i=0; i<time_split.length; i++){
          result += time_split[i] + "<br>";
        }
        result = result.slice(0, -4);
      }
    }else{
      result = "";
    }

    return result;
  }
}
