import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './user-panel/admin-panel/admin-panel.component';
import { AlbumComponent } from './album/album.component';
import { AuthGuard } from './auth-guard.guard';
import { CustomPreloadingStrategy } from './custom-preloading-strategy.service';
import { ImageDecoderComponent } from './image-decoder/image-decoder.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ProfileComponent } from './user-panel/profile/profile.component';

const routes: Routes = [
  {path: 'home', redirectTo: 'encode'},
  {path: 'encode', component: ImageUploaderComponent},
  {path: 'decode', component: ImageDecoderComponent},
  {path: 'album', component: AlbumComponent ,canActivate: [AuthGuard]},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard]},
  {path: 'profile', loadChildren: () => import('./user-panel/user-panel.module').then((m) => m.UserPanelModule), data: {preload: true}, component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '.', redirectTo: 'home' ,pathMatch: 'full'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
