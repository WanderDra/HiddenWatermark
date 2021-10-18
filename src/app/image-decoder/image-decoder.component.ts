import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, tap } from 'rxjs/operators';
import { Buffer } from 'buffer';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AlbumBottomSheetComponent } from '../album-bottom-sheet/album-bottom-sheet.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-decoder',
  templateUrl: './image-decoder.component.html',
  styleUrls: ['./image-decoder.component.css']
})
export class ImageDecoderComponent implements OnInit {

  originalImgUrl: string | undefined = '';
  encodedImgUrl: string | undefined = '';
  decodedImg = null;
  decodedImgUrl = '';
  warning = '';
  isImgUpload = false;
  isEncUpload = false;
  isLogin = false;

  constructor(
    private http: HttpClient, 
    private fileAPI: FileAPIService,
    private restAPI: RestAPIService,
    private bottomSheet: MatBottomSheet
    ) {
    }

  ngOnInit(): void {
    this.restAPI.isLoggedIn$.subscribe(data =>{
      this.isLogin = data;
    })
    this.fileAPI.imgUrl$.subscribe(data => {
      this.originalImgUrl = data;
    });
    this.fileAPI.encUrl$.subscribe(data => {
      this.encodedImgUrl = data;
    });
    // this.fileAPI.imgFile$.next(undefined);
    // this.fileAPI.imgUrl$.next(undefined);
    // this.fileAPI.encFile$.next(undefined);
    // this.fileAPI.encUrl$.next(undefined);
    this.isImgUpload = false;
    this.isEncUpload = false;

  }

  imageBrowseHandler(evt: EventTarget | null){
    if (evt){
      this.isImgUpload = true;
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.fileAPI.imgFile$.next(image.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.fileAPI.imgUrl$.next(reader.result as string);
        };
      }
    }
  }

  encodedImageBrowseHandler(evt: EventTarget | null){
    if (evt){
      this.isEncUpload = true;
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.fileAPI.encFile$.next(image.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.fileAPI.encUrl$.next(reader.result as string);
        };
      }
    }

  }

  onDecodeBtnClicked(){
    if (this.fileAPI.encUrl$.value && this.fileAPI.imgUrl$.value){
      this.warning = '';
      let originalImageUrl = '';
      let encodedImgUrl = '';
      let oriUploadSub: Observable<any> | undefined = undefined;
      let encodedUploadSub: Observable<any> | undefined = undefined;
      if (this.isImgUpload){
        oriUploadSub = this.restAPI.upload(this.fileAPI.imgFile$.value!, 'image')!
          .pipe(
            tap((res: any) => {
              originalImageUrl = res.res;
            })
          );
      }else{
        originalImageUrl = this.restAPI.getOldUrl(this.fileAPI.imgUrl$.value)!
      }
      if (this.isEncUpload){
        encodedUploadSub = this.restAPI.upload(this.fileAPI.encFile$.value!, 'encoded')!
          .pipe(
            tap((res: any) =>{
              // this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
              encodedImgUrl = res.res;
            })
          );
      }else{
        encodedImgUrl = this.restAPI.getOldUrl(this.fileAPI.encUrl$.value)!;
      }
      
      if (oriUploadSub && encodedUploadSub){
        oriUploadSub.pipe(
          concatMap(() => encodedUploadSub!),
          concatMap(() => this.restAPI.decode(originalImageUrl, encodedImgUrl)),
          tap((res) => {
            this.decodedImg = res.res;
            this.decodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      } else if(oriUploadSub){
        oriUploadSub.pipe(
          concatMap(() => this.restAPI.decode(originalImageUrl, encodedImgUrl)),
          tap((res) => {
            this.decodedImg = res.res;
            this.decodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      } else if(encodedUploadSub){
        encodedUploadSub.pipe(
          concatMap(() => this.restAPI.decode(originalImageUrl, encodedImgUrl)),
          tap((res) => {
            this.decodedImg = res.res;
            this.decodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      }else{
        this.restAPI.decode(originalImageUrl, encodedImgUrl).pipe(
          tap((res) => {
            this.decodedImg = res.res;
            this.decodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      }
    } else{
      if (!this.fileAPI.encUrl$.value){
        this.warning = "*Please upload encoded Image."
      }
      if (!this.fileAPI.imgUrl$.value){
        this.warning = "*Please upload original image."
      }
    }
  }

  openAlbum(type: string){
    this.bottomSheet.open(AlbumBottomSheetComponent, {data: {type}});
  }

  onImageCancelBtnClicked(){
    this.fileAPI.imgFile$.next(undefined);
    this.fileAPI.imgUrl$.next(undefined);
    this.isImgUpload = false;
  }

  onEncCancelBtnClicked(){
    this.fileAPI.encFile$.next(undefined);
    this.fileAPI.encUrl$.next(undefined);
    this.isEncUpload = false;
  }

}
