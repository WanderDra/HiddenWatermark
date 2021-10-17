import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';
import { Buffer } from 'buffer';
import { concat, Observable } from 'rxjs';
import { concatMap, exhaustMap, takeUntil, tap } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AlbumBottomSheetComponent } from '../album-bottom-sheet/album-bottom-sheet.component';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  
  fileName = '';
  watermarkName = '';
  file?: File;
  watermark?: File;
  fileurl : string | File;
  watermarkurl : string | File;
  encodedImg = null;
  encodedImgUrl = '';
  warning = '';

  constructor(
    private http: HttpClient, 
    private fileAPI: FileAPIService,
    private restAPI: RestAPIService,
    private bottomSheet: MatBottomSheet
    ) {
      this.fileurl = '';
      this.watermarkurl = '';
    }

  ngOnInit(): void {
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if (file){
      this.fileName = file.name;
      this.file = file;
    }
  }

  onWatermarkSelected(event: any){
    const file:File = event.target.files[0];
    if (file){
      this.watermarkName = file.name;
      this.watermark = file;
    }
  }

  onUploadClicked(){
    // this.http.get('http://127.0.0.1:3000/').subscribe();
    if (this.file && this.watermark){
      this.fileAPI.uploadOriginalmg('111', this.file).subscribe(
        ()=>{
          console.log('Img Uploaded');
        },
        (err) => {
          
        }
      );
      this.fileAPI.uploadWM('111', this.watermark).subscribe(
        ()=>{
          console.log('Wm Uploaded');
        },
        (err) => {
          
        }
      );
    }
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
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.file = image.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.fileurl = reader.result as string;
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
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.watermark = image.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.watermarkurl = reader.result as string;
        };
      }
    }

  }

  onEncodeBtnClicked(){
    if (this.watermark && this.file){
      this.warning = '';
      let imageUrl = '';
      let wmUrl = '';
      let imgUploadSub = this.restAPI.upload(this.file, 'image');
      let wmUploadSub = this.restAPI.upload(this.watermark, 'wm');
      imgUploadSub = imgUploadSub?.pipe(
        tap((res: any) => {
          imageUrl = res.res;
        })
      )
      wmUploadSub = wmUploadSub?.pipe(
        tap((res: any) =>{
          // this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
          wmUrl = res.res;
        })
      )
      
      if (imgUploadSub && wmUploadSub){
        imgUploadSub.pipe(
          concatMap(() => wmUploadSub!),
          concatMap(() => this.restAPI.encode(imageUrl, wmUrl)),
          tap((res) => {
            this.encodedImg = res.res;
            this.encodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      }
    } else{
      if (!this.watermark){
        this.warning = "*Please upload watermark."
      }
      if (!this.file){
        this.warning = "*Please upload original image."
      }
    }
  }

  openAlbum(type: string){
    this.bottomSheet.open(AlbumBottomSheetComponent, {data: {type: type}});
  }

}
