import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';
import { Buffer } from 'buffer';

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
  fileurl = '';
  watermarkurl = '';

  constructor(
    private http: HttpClient, 
    private fileAPI: FileAPIService,
    private restAPI: RestAPIService
    ) { }

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
    if (evt){
      let image = evt as HTMLInputElement;
      if (image.files){
        this.restAPI.upload(image.files[0], 'image')?.subscribe(
          (res: any) => {
            // console.log(res);
            this.fileurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
          }
        );
        // this.file = image.files[0];
      }
    }
  }

  watermarkBrowseHandler(evt: EventTarget | null){
    if (evt){
      let watermark = evt as HTMLInputElement;
      if (watermark.files){
        this.restAPI.upload(watermark.files[0], 'wm')?.subscribe(
          (res: any) =>{
            this.watermarkurl = 'data:image/jpeg;base64,'+Buffer.from(res.img).toString('base64');
          }
        )
        // this.watermark = watermark.files[0];
      }
    }
  }

}
