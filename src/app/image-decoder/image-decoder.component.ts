import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, tap } from 'rxjs/operators';
import { Buffer } from 'buffer';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-image-decoder',
  templateUrl: './image-decoder.component.html',
  styleUrls: ['./image-decoder.component.css']
})
export class ImageDecoderComponent implements OnInit {

  originalImg?: File;
  encodedImg?: File;
  originalImgUrl : string | File;
  encodedImgUrl : string | File;
  decodedImg = null;
  decodedImgUrl = '';
  warning = '';

  constructor(
    private http: HttpClient, 
    private fileAPI: FileAPIService,
    private restAPI: RestAPIService
    ) {
      this.originalImgUrl = '';
      this.encodedImgUrl = '';
    }

  ngOnInit(): void {
  }

  imageBrowseHandler(evt: EventTarget | null){
    if (evt){
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.originalImg = image.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.originalImgUrl = reader.result as string;
        };
      }
    }
  }

  encodedImageBrowseHandler(evt: EventTarget | null){
    if (evt){
      let image = evt as HTMLInputElement;
      if (image.files){
        if (image.files[0].type.match(/image\/*/) === null){
          console.log("Invalid file type");
          return;
        }
        this.encodedImg = image.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        reader.onload = () => {
          this.encodedImgUrl = reader.result as string;
        };
      }
    }

  }

  onDecodeBtnClicked(){
    if (this.encodedImg && this.originalImg){
      this.warning = '';
      let originalImageUrl = '';
      let encodedImgUrl = '';
      let oriUploadSub = this.restAPI.upload(this.originalImg, 'image');
      let encodedUploadSub = this.restAPI.upload(this.encodedImg, 'encoded');
      oriUploadSub = oriUploadSub?.pipe(
        tap((res: any) => {
          originalImageUrl = res.res;
        })
      )
      encodedUploadSub = encodedUploadSub?.pipe(
        tap((res: any) =>{
          // this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
          encodedImgUrl = res.res;
        })
      )
      
      if (oriUploadSub && encodedUploadSub){
        oriUploadSub.pipe(
          concatMap(() => encodedUploadSub!),
          concatMap(() => this.restAPI.decode(originalImageUrl, encodedImgUrl)),
          tap((res) => {
            this.decodedImg = res.res;
            this.decodedImgUrl = 'data:image/jpeg;base64,'+Buffer.from(res.res).toString('base64');
          })
        ).subscribe();
      }
    } else{
      if (!this.encodedImg){
        this.warning = "*Please upload encoded Image."
      }
      if (!this.originalImg){
        this.warning = "*Please upload original image."
      }
    }
  }

}
