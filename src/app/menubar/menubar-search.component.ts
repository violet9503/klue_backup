import { Component, EventEmitter, Output } from '@angular/core';
import { Router }  from '@angular/router';

@Component({
  selector: 'menubar-search',
  templateUrl: './menubar-search.component.html',
  styleUrls: ['./menubar-search.component.css']
})
export class MenubarSearchComponent {

  @Output() close = new EventEmitter<boolean>();

  constructor(private router:Router){}

  closeSearch(){
    this.close.emit(true);
  }

  onSearch(keyword:string, select:string){
    if(keyword.length == 0){
      alert('검색어를 입력해주세요.');
      return;
    }else if(select == ""){
      alert('카테고리를 선택해주세요.');
      return;
    }

    if(select == "note"){
      this.close.emit(true);
      this.router.navigate(['note/search/', keyword]);
    } else if(select == "lecture"){
      this.close.emit(true);
      this.router.navigate(['lecture/search/', keyword]);
    }
  }
}
