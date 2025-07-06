import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {DropPicService} from "../services/drop-pic.service";
import {DropAreaDirective} from "../directives/drop-area.directive";
import {DraggableDirective} from "../directives/draggable.directive";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'drop-pic',
  imports: [
    DropAreaDirective,
    DraggableDirective,
    NgOptimizedImage
  ],
  templateUrl: 'drop-pic.component.html',
  standalone: true,
  styleUrl: 'drop-pic.css'
})
export class DropPicComponent implements OnInit, OnDestroy {
  fileBeingDragged = false;
  imagePreviews: string[] = []
  loadingImages: number[] = []
  pickedFileIndex = -1

  @ViewChild('draggingIcon') draggingIcon!: ElementRef
  @ViewChild('draggingIconImage') draggingIconImage!: ElementRef
  @ViewChildren('imagePreviewContainer') imageContainers!: QueryList<ElementRef>

  constructor(private picturesSrv: DropPicService, private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.picturesSrv.clearFiles() // In case some previous files were in the server due to some error
    this.picturesSrv.previewUrls$.subscribe(previews => this.imagePreviews = previews)
  }

  ngOnDestroy(): void {
    this.picturesSrv.clearFiles();
  }

  // Private Methods
  /**
   * Handles the dragover event to indicate that a file is being dragged over the drop area.
   * It sets the fileBeingDragged property to true or false based on the event.
   * @param event The dragover event.
   */
  onDragOver(event: boolean): void {
    this.fileBeingDragged = event;
  }

  /**
   * Handles the dragover event to prevent default behavior and indicate that an element is being dragged over.
   * @param event The dragover event.
   */
  onElementDropped(event: DragEvent) {
    const fileList = event.dataTransfer?.files;
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      this.picturesSrv.addFile(file).then()
    }
  }

  /**
   * Handles the click event on the remove button for a specific image.
   * It calls the removeFile method of the pictures service to remove the image at the specified index.
   * @param index The index of the image to be removed.
   */
  onRemoveButtonClicked(index: number) {
    this.picturesSrv.removeFile(index)
  }

  /**
   * Handles the file selection event when files are selected through the file input.
   * It adds each selected file to the pictures service.
   * @param event The change event from the file input.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (const file of Array.from(input.files)) {
        this.picturesSrv.addFile(file);
      }
    }
  }

  onImagePicked(index: number, position: [number, number]) {
    this.pickedFileIndex = index
    this.showDraggingIcon(index)
    this.moveDraggingIcon(position)
  }

  onImagePickedDropped(newPosition: [number, number]) {
    this.pickedFileIndex = -1
    this.hideDraggingIcon()
  }

  onPickedImageDragged(newPosition: [number, number]) {
    const index = this.findImageByCoordinates(newPosition[0], newPosition[1])
    if (index != null) {
      if (this.pickedFileIndex >= 0 && this.pickedFileIndex != index) {
        this.picturesSrv.swapFiles(index, this.pickedFileIndex)
        this.pickedFileIndex = index
      }
    }
    this.moveDraggingIcon(newPosition)
  }

  /**
   * Returns the index of the picture placed on the given x,y coordinates, or null if no image is placed inside the
   * coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @private
   */
  private findImageByCoordinates(x: number, y: number): number | null {
    if (this.imageContainers) {
      const elements = this.imageContainers.toArray()
      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].nativeElement.getBoundingClientRect();
        const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        if (isInside) {
          return i;
        }
      }
    }
    return null
  }

  /**
   * Moves the dragging icon to the new position.
   * @param newPosition The new position of the dragging icon as an array [x, y].
   * @private
   */
  private moveDraggingIcon(newPosition: [number, number]) {
    const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize) * 5;
    this.renderer.setStyle(this.draggingIcon.nativeElement, 'top', `${newPosition[1] - remInPixels}px`)
    this.renderer.setStyle(this.draggingIcon.nativeElement, 'left', `${newPosition[0] - remInPixels}px`)
  }

  /**
   * Shows the dragging icon with the image preview at the specified index.
   * @param index The index of the image preview to show in the dragging icon.
   * @private
   */
  private showDraggingIcon(index: number) {
    this.renderer.setStyle(this.draggingIcon.nativeElement, 'visibility', 'visible')
    this.renderer.setAttribute(this.draggingIconImage.nativeElement, 'src', this.imagePreviews[index]);
  }

  /**
   * Hides the dragging icon by resetting its visibility.
   * @private
   */
  private hideDraggingIcon() {
    this.renderer.setStyle(this.draggingIcon.nativeElement, 'visibility', '')
  }
}
