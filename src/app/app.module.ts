import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AMModulesModule } from './ammodules.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './jwt.interceptor';
import { DropFileDirective } from './drop-file.directive';
import { ImageDecoderComponent } from './image-decoder/image-decoder.component';
import { SrcAuthPipe } from './src-auth.pipe';
import { AlbumContainerComponent } from './album-container/album-container.component';
import { AlbumBottomSheetComponent } from './album-bottom-sheet/album-bottom-sheet.component';
import { AlbumComponent } from './album/album.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImageUploaderComponent,
    LoginPanelComponent,
    DropFileDirective,
    ImageDecoderComponent,
    SrcAuthPipe,
    AlbumContainerComponent,
    AlbumComponent,
    AlbumBottomSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AMModulesModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
