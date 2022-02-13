import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared.module';

import {NoteResultComponent} from './note-result.component';
import {NoteViewComponent} from './note-view.component';
import {NoteSearchComponent} from './note-search/note-search.component';
import {NoteListComponent} from './note-list/note-list.component';
import {NoteLatestComponent} from './note-list/note-latest.component';
import {NoteUploadComponent} from './note-upload/note-upload.component';
import {NoteMainComponent} from './note-main/note-main.component';

import {NoteRoutingModule} from './note-routing.module';


@NgModule({
  imports: [
    CommonModule,
    NoteRoutingModule,
    SharedModule
  ],
  declarations: [
    NoteResultComponent,
    NoteViewComponent,
    NoteSearchComponent,
    NoteListComponent,
    NoteLatestComponent,
    NoteUploadComponent,
    NoteMainComponent
  ]
})
export class NoteModule {
}
