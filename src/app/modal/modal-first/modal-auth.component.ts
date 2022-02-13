import { Component, Output, EventEmitter } from '@angular/core';
import {UserService} from '../../user.service';

@Component({
  selector: 'modal-auth',
  templateUrl: './modal-auth.component.html',
  styleUrls: ['./modal-auth.component.css']
})
export class ModalAuthComponent {
  constructor(private userService: UserService){}
}
