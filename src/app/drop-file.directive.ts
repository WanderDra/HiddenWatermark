import { Directive, HostListener, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {

  @Output() imageUploaded = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt: Event){
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: Event){
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(evt: any){
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if( files.length > 0){
      console.log("files dropped");
      this.imageUploaded.emit(evt.dataTransfer);
    }
  }

}
