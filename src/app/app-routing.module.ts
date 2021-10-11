import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';

const routes: Routes = [
  {path: 'encode', component: ImageUploaderComponent},
  {path: 'decode', redirectTo: ''},
  {path: 'album', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
