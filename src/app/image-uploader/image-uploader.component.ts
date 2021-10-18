import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';
import { Buffer } from 'buffer';
import { concat, Observable, Subscriber, Subscription } from 'rxjs';
import { concatMap, exhaustMap, takeUntil, tap } from 'rxjs/operators';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AlbumBottomSheetComponent } from '../album-bottom-sheet/album-bottom-sheet.component';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  
  fileurl?: string;
  watermarkurl?: string;
  encodedImg: File | undefined = undefined;
  encodedImgUrl = '';
  warning = '';
  isImgUpload = false;
  isWMUpload = false;
  isLogin = false;

  constructor(
    private http: HttpClient, 
    private fileAPI: FileAPIService,
    private restAPI: RestAPIService,
    private bottomSheet: MatBottomSheet
    ) {
    }

  ngOnInit(): void {
    this.restAPI.isLoggedIn$.subscribe(data => {
      this.isLogin = data;
    })
    this.fileAPI.imgUrl$.subscribe(data => {
      this.fileurl = data;
    })
    this.fileAPI.wmUrl$.subscribe(data => {
      this.watermarkurl = data;
    })
    // this.fileAPI.imgFile$.next(undefined);
    // this.fileAPI.imgUrl$.next(undefined);
    // this.fileAPI.wmFile$.next(undefined);
    // this.fileAPI.wmUrl$.next(undefined);
    this.isImgUpload = false;
    this.isWMUpload = false;
  }

  imageBrowseHandler(evt: EventTarget | null){
    // if (evt){
    //   let image = evt as HTMLInputElement;
    //   if (image.files){
    //     this.restAPI.upload(image.files[0], 'image')?.subscribe(
    //       (res: any) => {
    //         // console.log(res);
    //         this.fileurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
    //       }
    //     );
    //     // this.file = image.files[0];
    //   }
    // }
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

  watermarkBrowseHandler(evt: EventTarget | null){
    // if (evt){
    //   let watermark = evt as HTMLInputElement;
    //   if (watermark.files){
    //     this.restAPI.upload(watermark.files[0], 'wm')?.subscribe(
    //       (res: any) =>{
    //         this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
    //       }
    //     )
    //     // this.watermark = watermark.files[0];
    //   }
    // }
    if (evt){
      this.isWMUpload = true;
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.fileAPI.wmFile$.next(image.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.fileAPI.wmUrl$.next(reader.result as string);
        };
      }
    }

  }

  onEncodeBtnClicked(){
    if (this.fileAPI.wmUrl$.value && this.fileAPI.imgUrl$.value){
      this.warning = '';
      let imageUrl = '';
      let wmUrl = '';
      let imgUploadSub: Observable<any> | undefined = undefined;
      let wmUploadSub: Observable<any> | undefined = undefined;
      if (this.isImgUpload){
        imgUploadSub = this.restAPI.upload(this.fileAPI.imgFile$.value!, 'image')!
          .pipe(
            tap((res: any) => {
              imageUrl = res.res;
            })
          )
      }else{
        imageUrl = this.restAPI.getOldUrl(this.fileAPI.imgUrl$.value)!;
      }
      if (this.isWMUpload){
        wmUploadSub = this.restAPI.upload(this.fileAPI.wmFile$.value!, 'wm')!
          .pipe(
            tap((res: any) =>{
              // this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
              wmUrl = res.res;
            })
          )
      }else{
        wmUrl = this.restAPI.getOldUrl(this.fileAPI.wmUrl$.value)!;
      }
      
      if (imgUploadSub && wmUploadSub){
        imgUploadSub.pipe(
          concatMap(() => wmUploadSub!),
          concatMap(() => {
            console.log(imageUrl, wmUrl);
            return this.restAPI.encode(imageUrl, wmUrl)
          }),
          tap((res) => {
            this.encodedImg = res.res;
            this.encodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      } else if(imgUploadSub){
        imgUploadSub.pipe(
          concatMap(() => this.restAPI.encode(imageUrl, wmUrl)),
          tap((res) => {
            this.encodedImg = res.res;
            this.encodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      } else if(wmUploadSub){
        wmUploadSub.pipe(
          concatMap(() => this.restAPI.encode(imageUrl, wmUrl)),
          tap((res) => {
            this.encodedImg = res.res;
            this.encodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      } else{
        this.restAPI.encode(imageUrl, wmUrl).pipe(
          tap((res) => {
            this.encodedImg = res.res;
            this.encodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      }
    } else{
      if (!this.fileAPI.wmUrl$.value){
        this.warning = "*Please upload watermark."
      }
      if (!this.fileAPI.imgUrl$.value){
        this.warning = "*Please upload original image."
      }
    }
  }

  openAlbum(type: string){
    this.bottomSheet.open(AlbumBottomSheetComponent, {data: {type: type}});
  }

  onImageCancelBtnClicked(){
    this.fileAPI.imgFile$.next(undefined);
    this.fileAPI.imgUrl$.next(undefined);
    this.isImgUpload = false;
  }

  onWMCancelBtnClicked(){
    this.fileAPI.wmFile$.next(undefined);
    this.fileAPI.wmUrl$.next(undefined);
    this.isWMUpload = false;
  }

}
