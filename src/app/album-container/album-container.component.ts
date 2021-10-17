import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  
  @Output() selected = new EventEmitter<number | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

  onImgClicked(index: number){
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
    return;
  }

}
