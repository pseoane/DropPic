# DropPic Package

`DropPic` is an Angular library that provides a drag-and-drop interface for uploading and managing images. It includes a standalone component (`DropPicComponent`) and a service (`DropPicService`) to handle image previews, reordering, and file management. This package is ideal for building image galleries or file upload interfaces.

This library exposes two main entities:
- `DropPicComponent`: A standalone component that provides a user interface for uploading and managing images.
- `DropPicService`: A service that manages the files and their previews, allowing other components or services to interact with the images uploaded through the `DropPicComponent`.
## Features

- Drag-and-drop image upload.
- Manual file selection via a button.
- Image preview with customizable styles.
- Reordering images by dragging.
- Remove images with a dedicated button.
- Highlight the first image in the list.
- Customizable loading indicators.
- Fully customizable via `@Input` properties.
- Centralized file and preview management using the `DropPicService`.

## Installation

1. Install the package and its dependencies:
 ```bash
 npm install drop-pic
 ```

2. Import the component and service into your Angular project:
 ```typescript
 import {DropPicComponent, DropPicService} from 'drop-pic'
 ```

## Usage

### Component

Add the `DropPicComponent` to your template:

```html
<drop-pic
  [acceptedFileFormats]="'.jpg,.jpeg,.png'"
  [dropImagesHereText]="'Drop your images here'"
  [selectImagesManuallyText]="'Select images manually'"
  [shallDisplayImageNumber]="true"
  [shallDisplayRemoveButton]="true"
  [shallHighlightFirstImage]="true"
  [backgroundColor]="'#f0f0f0'"
  [textColor]="'#333'"
  [border]="'2px dashed #ccc'"
></drop-pic>
```

The images added by the user can be accessed by any component/service in your app through the `DropPicService`, whose `getFiles`
method returns an array of `File` objects, in the exact same ordered as they are shown to the user (that is, if the user has reordered
the images via drag&Drop, the array of files will get updated with the new order). 

Additionally, you can add/remove/remove images from any component/service in your app also through the `DropPicService`, and the `DropPicComponent` will automatically display the updates.

### Service

Inject the `DropPicService` into any of your components / services to manage the files and previews 
that will be displayed by the `DropPicComponent`. For example:

```typescript
import { Component } from '@angular/core';
import { DropPicService } from 'path-to-drop-pic/drop-pic.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  constructor(private dropPicService: DropPicService) {}

  /**
   * Example method, called when some form's submit button is clicked
   */
  onSubmitButtonClicked() {
    let images = this.dropPicService.files;
    publishImagesToServer(images);
  }

  /**
   * Example method, called when some images where received from the server. 
   * Any DropPicComponent in your app will display the images, as this method updates them in the service.
   * This method can be useful for a form that allows the user to add, remove and/or reorder the current images on a server.
   */
  async onImagesReceivedFromServer(images: File[]) {
    // Increase the counter of images being loaded by the number of images that are currently being added. This
    // will make DropPicComponent display the loading indicators for each of the images being added.
    this.dropPicService.increaseNumberOfImagesBeingLoaded(images.length);
    for (const image of images) {
      try {
        await this.dropPicService.addFile(image);
      } catch(error) {
        console.error("Error while adding file " + file.name + ": "  + error);
      }
      // Decrease the counter of images being loaded by one. This will make DropPicCompoment remove one loading indicator.
      this.dropPicService.decreaseNumberOfImagesBeingLoaded(); 
    }
  }
}
```

## DropPicComponent

### Inputs

| **Property**                                | **Type**      | **Default Value**                                                                                    | **Description**                                                                                     |
|---------------------------------------------|---------------|------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `acceptedFileFormats`                       | `string`      | `.jpg,.jpeg,.webp,.png,.heic`                                                                        | File formats accepted by the input.                                                                |
| `addMoreImagesButtonBackgroundColor`        | `string`      | `undefined` (inherit from parent element)                                                            | Background color of the button to add more images (+ button).                                      |
| `addMoreImagesButtonBackgroundColorOnHover` | `string`      | `#1c1c1b`                                                                                            | Background color of the button to add more images when hovered (+ button).                         |
| `addMoreImagesButtonBorder`                 | `string`      | `2px dashed #2c3e50`                                                                                 | The style of the border of the button to add more images (+ button).                               |
| `addMoreImagesButtonBorderOnHover`          | `string`      | `undefined` (inherit from parent element)                                                                      | The style of the border of the button to add more images when hovered (+ button).                  |
| `addMoreImagesButtonTextColor`              | `string`      | `undefined`  (inherit from parent element)                                                                                         | Text color of the button to add more images (+ button).                                            |
| `addMoreImagesButtonTextColorOnHover`       | `string`      | `#ffffff`                                                                                            | Text color of the button to add more images when hovered (+ button).                               |
| `backgroundColor`                           | `string`      | `#e8e2d9`                                                                                            | The color of the background of the drop area.                                                      |
| `border`                                    | `string`      | `dashed 1px #979797`                                                                                 | The style of the border of the drop area.                                                          |
| `dragImageToReorderHintText`                | `string`      | `Drag to reorder`                                                                                    | Text to indicate that images can be reordered by dragging.                                         |
| `dragImageToReorderHintTextBackgroundColor` | `string`      | `#000000`                                                                                            | Background color of the text to indicate that images can be reordered by dragging (on hover).      |
| `dragImageToReorderHintTextColor`           | `string`      | `#ffffff`                                                                                            | Color of the text to indicate that images can be reordered by dragging.                            |
| `dragImagesHereText`                        | `string`      | `Drag images here`                                                                                   | Text to indicate that images can be dragged into the component.                                    |
| `dropImagesHereBackgroundColor`             | `string`      | `#000000`                                                                                            | Background of the text to indicate that images can be selected manually.                           |
| `dropImagesHereBorder`                      | `string`      | `undefined`                                                                                          | Style of the text to indicate that images can be selected manually.                                |
| `dropImagesHereText`                        | `string`      | `Drop images here`                                                                                   | Text to indicate that images can be dropped into the component.                                    |
| `dropImagesHereTextColor`                   | `string`      | `#ffffff`                                                                                            | Color of the text to indicate that images can be selected manually.                                |
| `highlightedImageBorder`                    | `string`      | `2px solid #FFD700`                                                                                  | If the first image shall be highlighted, this property specifies the border style of the image.    |
| `loadingIndicatorBackground`                | `string`      | `linear-gradient(110deg, rgba(28, 28, 27, 1) 12%, rgba(38, 38, 38, 1) 18%, rgba(28, 28, 27, 1) 33%)` | The background of the loading indicator.                                                           |
| `selectImagesManuallyButtonBackgroundColor` | `string`      | `undefined`  (inherit from parent element)                                                                                 | The style of the background of the button to select images manually.                               |
| `selectImagesManuallyButtonBackgroundColorOnHover` | `string` | `undefined`      (inherit from parent element)                                                                                     | The style of the hover background of the button to select images manually.                         |
| `selectImagesManuallyButtonBorder`          | `string`      | `undefined`   (inherit from parent element)                                                                                        | The style of the border of the button to select images manually.                                   |
| `selectImagesManuallyButtonBorderOnHover`   | `string`      | `undefined`   (inherit from parent element)                                                                                        | The style of the hover border of the button to select images manually.                             |
| `selectImagesManuallyButtonTextColor`       | `string`      | `undefined`   (inherit from parent element)                                                                                        | The color of the text inside the button to select images manually.                                 |
| `selectImagesManuallyButtonTextColorOnHover`| `string`      | `undefined`    (inherit from parent element)                                                                                       | The style of the hover text inside the button to select images manually.                           |
| `selectImagesManuallyText`                  | `string`      | `Or select them manually`                                                                            | Text to indicate that images can be selected manually.                                             |
| `shallDisplayImageNumber`                   | `boolean`     | `true`                                                                                               | True if the component should display the image number on each image preview.                       |
| `shallDisplayLoadingIndicator`              | `boolean`     | `true`                                                                                               | If true, the component will display a loading indicator for each of the images being loaded.       |
| `shallDisplayRemoveButton`                  | `boolean`     | `true`                                                                                               | True if the image previews shall include a remove button.                                          |
| `shallHighlightFirstImage`                  | `boolean`     | `true`                                                                                               | True if the component should highlight the first image in the list.                                |
| `textColor`                                 | `string`      | `#1c1c1b`                                                                                            | The color of the text inside the drop area.                                                        |


## DropPicService

### Methods

| **Method**                                   | **Signature**                                  | **Description**                                                                 |
|----------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------|
| `addFile`                                    | `(newFile: File): Promise<void>`               | Adds a new file to the service and loads its preview. If the preview load fails, the file won't get added. |
| `clearFiles`                                 | `(): void`                                     | Clears all files and their previews from the service.                           |
| `decreaseNumberOfImagesBeingLoaded`          | `(decreaseAmount?: number): void`              | Decreases the number of images currently being loaded. Prevents the count from going below zero. |
| `increaseNumberOfImagesBeingLoaded`          | `(increaseAmount?: number): void`              | Increases the number of images currently being loaded. Useful for showing loading indicators. |
| `removeFile`                                 | `(index: number): void`                        | Removes a file and its preview at the specified index.                          |
| `resetNumberOfImagesBeingLoaded`             | `(): void`                                     | Resets the number of images being loaded to zero. Useful for resetting state.   |
| `swapFiles`                                  | `(index1: number, index2: number): void`       | Swaps two files and their previews at the specified indices.                    |


### Properties

| **Property**                 | **Type**               | **Initial Value** | **Description**                                                                 |
|------------------------------|------------------------|-------------------|---------------------------------------------------------------------------------|
| `files`                      | `File[]`               | `[]`              | Returns a shallow copy of the current list of files.                            |
| `numberOfImagesBeingLoaded$` | `Observable<number>`    | `0`               | Emits the current number of images that are being loaded (useful for indicators).|
| `previewUrls$`               | `Observable<string[]>`  | `[]`              | Emits the current list of image preview URLs.                                   |

## License

This package is licensed under the MIT License.

