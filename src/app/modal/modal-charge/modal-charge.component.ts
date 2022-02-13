import { Component } from '@angular/core';
import { SharedService} from '../../shared-service';

@Component({
  selector: 'modal-charge',
  templateUrl: './modal-charge.component.html',
  styleUrls: ['./modal-charge.component.css']
})
export class ModalChargeComponent {
  chargeMoney:number = 0;

  selectChange(value:string){
    this.chargeMoney = parseInt(value)*110;
    console.log(value);
  }
}
