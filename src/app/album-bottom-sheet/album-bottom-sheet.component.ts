import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-album-bottom-sheet',
  templateUrl: './album-bottom-sheet.component.html',
  styleUrls: ['./album-bottom-sheet.component.css']
})
export class AlbumBottomSheetComponent implements OnInit {

  title = "TestTest";
  type = "";
  imgList: Array<{src: string, isSelected: string}> = [];
  selected: number | undefined = undefined;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AlbumBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {type: string},
    private restAPI: RestAPIService
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

}
