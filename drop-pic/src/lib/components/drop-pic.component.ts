import {
  Component,
  ElementRef, Input,
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
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
  selector: 'drop-pic',
  imports: [
    DropAreaDirective,
    DraggableDirective,
    NgOptimizedImage,
    NgStyle
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

  /**
   * File formats accepted by the input
   */
  @Input()
  acceptedFileFormats: string = ".jpg,.jpeg,.webp,.png,.heic"

  /**
   * Text to indicate that images can be dropped into the component.
   */
  @Input()
  dropImagesHereText: string = "Drop images here";

  /**
   * Background of the text to indicate that images can be selected manually.
   */
  @Input()
  dropImagesHereBackgroundColor: string | undefined;

  /**
   * Color of the text to indicate that images can be selected manually.
   */
  @Input()
  dropImagesHereTextColor: string | undefined;

  /**
   * Style of the text to indicate that images can be selected manually.
   */
  @Input()
  dropImagesHereBorder: string | undefined;

  /**
   * Text to indicate that images can be dragged into the component.
   */
  @Input()
  dragImagesHereText: string = "Drag images here";

  /**
   * Text to indicate that images can be selected manually.
   */
  @Input()
  selectImagesManuallyText: string = "Or select them manually";

  /**
   * Text to indicate that images can be reordered by dragging.
   */
  @Input()
  dragImageToReorderHintText: string = "Drag to reorder";

  /**
   * Color of the text to indicate that images can be reordered by dragging.
   */
  @Input()
  dragImageToReorderHintTextColor: string | undefined = undefined;

  /**
   * Background color of the text to indicate that images can be reordered by dragging.
   * This is applied when the user hovers over the text.
   */
  @Input()
  dragImageToReorderHintTextBackgroundColor: string | undefined = undefined;

  /**
   * True if the component should display the image number on each image preview.
   */
  @Input()
  shallDisplayImageNumber: boolean = true;

  /**
   * True if the image previews shall include a remove button
   */
  @Input()
  shallDisplayRemoveButton: boolean = true;

  /**
   * True if the component should highlight the first image in the list.
   * This is useful for indicating the main image in a gallery.
   */
  @Input()
  shallHighlightFirstImage: boolean = true;

  /**
   * The color of the background of the drop area.
   */
  @Input()
  backgroundColor: string | undefined = undefined;

  /**
   * The color of the text inside the drop area.
   */
  @Input()
  textColor: string | undefined = undefined;

  /**
   * The style of the border of the drop area.
   */
  @Input()
  border: string | undefined = undefined;

  /**
   * The style of the background of the button to select images manually.
   */
  @Input()
  selectImagesManuallyButtonBackgroundColor: string | undefined = undefined;

  /**
   * The style of the hover background of the button to select images manually.
   * This is applied when the user hovers over the button.
   */
  @Input()
  selectImagesManuallyButtonBackgroundColorOnHover: string | undefined = undefined;

  /**
   * The color of the text inside the button to select images manually.
   */
  @Input()
  selectImagesManuallyButtonTextColor: string | undefined = undefined;

  /**
   * The style of the hover text inside the button to select images manually.
   * This is applied when the user hovers over the button.
   */
  @Input()
  selectImagesManuallyButtonTextColorOnHover: string | undefined = undefined;

  /**
   * The style of the border of the button to select images manually.
   */
  @Input()
  selectImagesManuallyButtonBorder: string | undefined = undefined;

  /**
   * The style of the hover border of the button to select images manually.
   * This is applied when the user hovers over the button.
   */
  @Input()
  selectImagesManuallyButtonBorderOnHover: string | undefined = undefined;

  /**
   * The style of the border of the button to add more images (+ button).
   */
  @Input()
  addMoreImagesButtonBorder: string | undefined = undefined;

  /**
   * The style of the border of the button to add more images when hovered (+ button).
   */
  @Input()
  addMoreImagesButtonBorderOnHover: string | undefined = undefined;

  /**
   * Background color of the button to add more images (+ button)
   */
  @Input()
  addMoreImagesButtonBackgroundColor: string | undefined = undefined;

  /**
   * Background color of the button to add more images when hovered (+ button)
   */
  @Input()
  addMoreImagesButtonBackgroundColorOnHover: string | undefined = undefined;

  /**
   * Text color of the button to add more images (+ button)
   */
  @Input()
  addMoreImagesButtonTextColor: string | undefined = undefined;

  /**
   * Text color of the button to add more images when hovered (+ button)
   */
  @Input()
  addMoreImagesButtonTextColorOnHover: string | undefined = undefined;

  /**
   * If the first image shall be highlighted, this property specifies the
   */
  @Input()
  highlightedImageBorder: string | undefined = undefined;

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
