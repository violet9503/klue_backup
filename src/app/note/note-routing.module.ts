import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NoteResultComponent} from './note-result.component';
import {NoteViewComponent} from './note-view.component';
import {NoteListComponent} from './note-list/note-list.component';
import {NoteLatestComponent} from './note-list/note-latest.component';
import {NoteUploadComponent} from './note-upload/note-upload.component';
import {NoteMainComponent} from './note-main/note-main.component';

import {NoteService} from './note.service';

import {AuthGuard} from '../auth-guard.service';

const noteRoutes: Routes = [
  {
    path: '',
    component: NoteResultComponent,
    children: [
      {
        path: 'main/:keyword',
        component: NoteMainComponent
      },
      {
        path: 'search/:id',
        component: NoteListComponent
      },
      {
        path: 'latest',
        component: NoteLatestComponent,
      }
    ]
  },
  {
    path: 'upload',
    component: NoteUploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: NoteViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(noteRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [NoteService]
})
export class NoteRoutingModule {
}
