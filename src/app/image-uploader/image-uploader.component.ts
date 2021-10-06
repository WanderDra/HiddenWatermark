import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) { }

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

  onConnectClicked(){
    this.http.get('http://127.0.0.1:3000/').subscribe();
  }

}
