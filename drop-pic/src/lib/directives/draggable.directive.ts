import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appDraggable]'
})
export class DraggableDirective {

  @Output() elementPicked = new EventEmitter<[number, number]>();
  @Output() elementDropped = new EventEmitter<[number, number]>();
  @Output() dragging = new EventEmitter<[number, number]>();

  private touchHoldTimeout: any

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    // MUST set data, or drag won't start
    event.dataTransfer?.setData('text/plain', 'drag');
    const transparentImage = new Image();
    transparentImage.src = '';
    event.dataTransfer?.setDragImage(transparentImage, 0, 0);
    this.elementPicked.emit([event.clientX, event.clientY]);
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent) {
    this.dragging.emit([event.clientX, event.clientY]);
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.elementDropped.emit([event.clientX, event.clientY]);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.dragging.emit([event.clientX, event.clientY])
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchHoldTimeout = setTimeout(() => {
      this.touchHoldTimeout = null
      this.elementPicked.emit([touch.clientX, touch.clientY]);
      event.preventDefault()
    }, 200);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault()
    const touch = event.touches[0];
    if (this.touchHoldTimeout) {
      return
    }
    this.dragging.emit([touch.clientX, touch.clientY]);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (this.touchHoldTimeout) {
      clearTimeout(this.touchHoldTimeout)
      this.touchHoldTimeout = null
      return
    }
    this.elementDropped.emit([touch.clientX, touch.clientY]);
  }

}
