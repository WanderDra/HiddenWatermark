import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlbumContainerComponent } from '../album-container/album-container.component';
import { FileAPIService } from '../file-api.service';
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
  imgList: Array<{name: string, src: string, isSelected: string}> = [];
  signList: Array<{name: string, src: string, isSelected: string}> = [];
  encList: Array<{name: string, src: string, isSelected: string}> = [];

  @ViewChild('Img', {static: true}) imgRef?: AlbumContainerComponent;
  @ViewChild('WM', {static: true}) wmRef?: AlbumContainerComponent;
  @ViewChild('Enc', {static: true}) encRef?: AlbumContainerComponent;


  constructor(
    private restAPI: RestAPIService, 
    private fileAPI: FileAPIService,
    private route: Router
    ) {
  }

  ngOnInit(): void {
    this.restAPI.getImages('original').subscribe((res: string[]) =>{
      if (res){
        res.forEach((imgName: string) => {
          this.imgList.push(
            {
              name: imgName,
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
              name: imgName,
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
              name: imgName,
              src: this.restAPI.getImageUrl('encoded', imgName), 
              isSelected: ""
            });
        })
      }
    });
  }

  onEncodeBtnClicked(){
    if (this.selectedImg !== undefined && this.selectedSign !== undefined){
      this.fileAPI.imgUrl$.next(this.imgList[this.selectedImg].src);
      this.fileAPI.wmUrl$.next(this.signList[this.selectedSign].src);
      this.route.navigate(['encode']);
    }
  }

  onDecodeBtnClicked(){
    if (this.selectedImg !== undefined && this.selectedEnc !== undefined){
      this.fileAPI.imgUrl$.next(this.imgList[this.selectedImg].src);
      this.fileAPI.encUrl$.next(this.encList[this.selectedEnc].src);
      this.route.navigate(['decode']);
    }
  }

  onDeleteBtnClicked(){
    this.imgRef?.switchMode()
    this.wmRef?.switchMode()
    this.encRef?.switchMode()

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
