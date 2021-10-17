import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FileAPIService } from '../file-api.service';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-album-bottom-sheet',
  templateUrl: './album-bottom-sheet.component.html',
  styleUrls: ['./album-bottom-sheet.component.css']
})
export class AlbumBottomSheetComponent implements OnInit {

  title = "TestTest";
  imgList: Array<{name: string, src: string, isSelected: string}> = [];
  selected: number | undefined = undefined;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AlbumBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {type: string},
    private restAPI: RestAPIService,
    private fileAPI: FileAPIService
    ) { 

  }

  ngOnInit(): void {
    this.getData(this.data.type);
  }

  getData(type: string){
    this.imgList = [];
    switch(type){
      case 'original':
        this.title = 'My Original Pictures';
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
        break;
      case 'wm':
        this.title = 'My Signatures';
        this.restAPI.getImages('wm').subscribe((res: string[]) =>{
          if (res){
            res.forEach((imgName: string) => {
              this.imgList.push(
                {
                  name: imgName,
                  src: this.restAPI.getImageUrl('wm', imgName), 
                  isSelected: ""
                });
            })
          }
        });
        break;
      case 'encoded':
        this.title = 'My Encoded Pictures';
        this.restAPI.getImages('encoded').subscribe((res: string[]) =>{
          if (res){
            res.forEach((imgName: string) => {
              this.imgList.push(
                {
                  name: imgName,
                  src: this.restAPI.getImageUrl('encoded', imgName), 
                  isSelected: ""
                });
            })
          }
        });
        break;
      default:
        this.title = "WRONG TYPE";
    }
  }

  getSelected(index: number | undefined){
    this.selected = index;
  }

  onSelectBtnClicked(){
    if (this.selected !== undefined){
      switch(this.data.type){
        case 'original':
          this.restAPI.getImageFromUrl(this.imgList[this.selected].src).subscribe(
            (res: File) => {
              this.fileAPI.imgFile$.next(res);
            }
          );
          this.fileAPI.imgUrl$.next(this.imgList[this.selected].src);
          break;
        case 'wm':
          this.restAPI.getImageFromUrl(this.imgList[this.selected].src).subscribe(
            (res: File) => {
              this.fileAPI.wmFile$.next(res);
            }
          );
          this.fileAPI.wmUrl$.next(this.imgList[this.selected].src);
          break;
        case 'encoded':
          this.restAPI.getImageFromUrl(this.imgList[this.selected].src).subscribe(
            (res: File) => {
              this.fileAPI.encFile$.next(res);
            }
          );
          this.fileAPI.encUrl$.next(this.imgList[this.selected].src);
          break;
      }
      console.log(this.imgList[this.selected].src);
    }
  }

}
