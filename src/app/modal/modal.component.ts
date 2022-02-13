import { Component, Input, OnChanges } from '@angular/core';
import {SharedService} from '../shared-service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnChanges{
  @Input() state: string;

  constructor(private sharedService:SharedService) {}

  widthExpand = false;
  isOut:boolean = true;

  ngOnChanges() {
    if(this.state == 'report' || this.state == 'charge')
      this.widthExpand = true;
  }

  modalOut(){
    if(this.isOut)
      this.sharedService.stateChange('close');
  }
}
