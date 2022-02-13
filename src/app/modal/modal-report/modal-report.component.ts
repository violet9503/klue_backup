import { Component } from '@angular/core';

import {SharedService} from '../../shared-service';
import {UserService} from '../../user.service';

@Component({
  selector: 'modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.css']
})
export class ModalReportComponent {
  isNext:boolean = false;
  private Url = 'https://api.develope.klue.kr';

  constructor(private sharedService: SharedService, private userService: UserService){}
  report(e){
    if(e.value.length == 0){
      alert('신고내용을 입력해주시기 바랍니다.')
      return;
    }

    this.userService.evalReport(this.sharedService.reportEvaluationId, e.value).subscribe(data => {

      if(data.code == 200){
        e.value = null;
        this.isNext = true;
      }else{
        console.log(data);
      }
    })
  }

  close(){
    this.sharedService.stateChange('close');
    this.isNext = false;
  }
}
