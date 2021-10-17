import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { AuthGuard } from './auth-guard.guard';
import { ImageDecoderComponent } from './image-decoder/image-decoder.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';

const routes: Routes = [
  {path: 'encode', component: ImageUploaderComponent},
  {path: 'decode', component: ImageDecoderComponent},
  {path: 'album', component:AlbumComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
