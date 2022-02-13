import {Component, OnDestroy} from '@angular/core';
import { Router }  from '@angular/router';
import {SharedService} from '../../shared-service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'note-search',
  templateUrl: './note-search.component.html',
  styleUrls: ['./note-search.component.css']
})
export class NoteSearchComponent implements OnDestroy{
  isOpen:boolean = false;
  searchValue:string = "";
  savedObservable:any;
  searchRange:number[] = [0,5];

  constructor(private router: Router, private sharedService: SharedService) {
    this.savedObservable = sharedService.changeKeyword$.subscribe(
      state => {
        this.searchValue = state;
      });
  }


  ngOnDestroy(){
    this.savedObservable.unsubscribe();
  }

  isClick(){
    this.isOpen = !this.isOpen;
  }

  onSearch(keyword:string){
    if(keyword.length == 0){
      alert('검색어를 입력해주세요');
    }else{
      this.router.navigate(['note/main', keyword]);
    }
  }
}
