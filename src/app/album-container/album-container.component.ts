import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-album-container',
  templateUrl: './album-container.component.html',
  styleUrls: ['./album-container.component.css']
})
export class AlbumContainerComponent implements OnInit {

  @Input() imageList: Array<{
    src: string,
    isSelected: string
  }> = [];
  
  selectedImg?: number;

  removeMode = false;
  
  @Output() selected = new EventEmitter<number | undefined>();

  constructor(private restAPI: RestAPIService) { }

  ngOnInit(): void {
  }

  switchMode(){
    this.removeMode = !this.removeMode;
    this.imageList.forEach((img) => img.isSelected = "");
  }

  onImgClicked(index: number){
    if (!this.removeMode){
      if (index === this.selectedImg){
        this.imageList[index].isSelected = "";
        this.selectedImg = undefined;
        this.selected.emit(this.selectedImg);
        return;
      }
      this.imageList[index].isSelected = "selected";
      if (this.selectedImg !== undefined){
        this.imageList[this.selectedImg].isSelected = "";
        this.selectedImg = index;
      }else{
        this.selectedImg = index;
      }
      this.selected.emit(this.selectedImg);
    } else{
      if (!this.imageList[index].isSelected){
        this.imageList[index].isSelected = "selected";
      }else{
        this.imageList[index].isSelected = "";
      }
    }
  }

  onRemoveClicked(){
    let removeList: Array<number> = [];
    this.imageList.forEach((img, i) =>{
      if (img.isSelected){
        this.restAPI.deleteImage(img.src).subscribe();
        removeList.push(i);
      }
    })
    this.imageList = this.imageList.reduce((acc, cur, i) => {
      if (!removeList.includes(i)){
        acc.push(cur);
      }
      return acc;
    }, new Array<{src: string, isSelected: string}>());
    
  }

}
