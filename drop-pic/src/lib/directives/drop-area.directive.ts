import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appDropArea]'
})
export class DropAreaDirective {

  @Output()
  draggingOver = new EventEmitter<boolean>(false);

  @Output()
  elementDropped = new EventEmitter<DragEvent>

  private dragLeaveTimeout: any;

  // If this is true, means that the user picked one of the elements inside the container (to perform a reorder, for instance)
  private dragEventDidStartInsideFrame = false

  constructor() {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.dragEventDidStartInsideFrame) {
      return
    }
    if (this.dragLeaveTimeout) {
      clearTimeout(this.dragLeaveTimeout);
      this.dragLeaveTimeout = null;
    }
    this.draggingOver.next(true)
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.dragEventDidStartInsideFrame = true
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    // Start a 100ms timer before considering the drag has left
    this.dragLeaveTimeout = setTimeout(() => {
      this.draggingOver.next(false);
      this.dragLeaveTimeout = null;
    }, 100);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.dragEventDidStartInsideFrame) {
      this.dragEventDidStartInsideFrame = false
      return
    }
    this.elementDropped.next(event)
    this.draggingOver.next(false)
  }
}
