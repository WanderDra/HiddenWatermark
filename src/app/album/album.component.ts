import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  selectedImg?: number;
  selectedSign?: number;
  selectedEnc?: number;
  imgList: Array<{src: string, isSelected: string}> = [];
  signList: Array<{src: string, isSelected: string}> = [];
  encList: Array<{src: string, isSelected: string}> = [];

  constructor(private restAPI: RestAPIService) {
  }

  ngOnInit(): void {
    this.restAPI.getImages('original').subscribe((res: string[]) =>{
      if (res){
        res.forEach((imgName: string) => {
          this.imgList.push(
            {
              src: this.restAPI.getImageUrl('original', imgName), 
              isSelected: ""
            });
        })
      }
    });
    this.restAPI.getImages('wm').subscribe((res: string[]) =>{
      if (res){
        res.forEach((imgName: string) => {
          this.signList.push(
            {
              src: this.restAPI.getImageUrl('wm', imgName), 
              isSelected: ""
            });
        })
      }
    });
    this.restAPI.getImages('encoded').subscribe((res: string[]) =>{
      if (res){
        res.forEach((imgName: string) => {
          this.encList.push(
            {
              src: this.restAPI.getImageUrl('encoded', imgName), 
              isSelected: ""
            });
        })
      }
    });
  }

  onEncodeBtnClicked(){
    
  }

  onDecodeBtnClicked(){

  }

  getSelectedImg(val: number | undefined){
    this.selectedImg = val;
  }
  getSelectedSign(val: number | undefined){
    this.selectedSign = val;
  }
  getSelectedEnc(val: number | undefined){
    this.selectedEnc = val;
  }

}
