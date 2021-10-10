import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileAPIService } from '../file-api.service';

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

  constructor(private http: HttpClient, private fileAPI: FileAPIService) { }

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

}
