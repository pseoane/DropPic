import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DropPicService {
  private _imagePreviewUrls$ = new BehaviorSubject<string[]>([])
  private _numberOfImagesBeingLoaded$ = new BehaviorSubject<number>(0)
  private _imagePreviewUrls: string[] = []
  private _numberOfImagesBeingLoaded: number = 0
  private _files: File[] = []

  constructor() { }

  /**
   * Adds a new file to the service and loads its preview. If the preview load fails, the file won't get added.
   * @param newFile
   */
  async addFile(newFile: File) {
    await this.loadPreview(newFile)
    this._files.push(newFile)
  }

  /**
   * Removes a file at the specified index from the service.
   * @param index The index of the file to remove.
   */
  removeFile(index: number) {
    this._files.splice(index, 1)
    this._imagePreviewUrls.splice(index, 1)
    this._imagePreviewUrls$.next([...this._imagePreviewUrls])
  }

  /**
   * Swaps two files at the specified indices.
   * @param index1 The index of the first file.
   * @param index2 The index of the second file.
   */
  swapFiles(index1: number, index2: number): void {
    if (index1 < 0 || index2 < 0 || index1 >= this._files.length || index2 >= this._files.length) {
      console.error('Invalid indices for swapping files.');
      return;
    }

    [this._files[index1], this._files[index2]] = [this._files[index2], this._files[index1]];
    [this._imagePreviewUrls[index1], this._imagePreviewUrls[index2]] = [this._imagePreviewUrls[index2], this._imagePreviewUrls[index1]];
    this._imagePreviewUrls$.next([...this._imagePreviewUrls]);
  }

  /**
   * Clears all files and their previews from the service.
   */
  clearFiles() {
    this._files = []
    this._imagePreviewUrls = []
    this._imagePreviewUrls$.next([])
  }

  /**
   * Increases the number of images that are currently being loaded. This is useful for showing loading indicators.
   * @param increaseAmount The amount by which to increase the count. Defaults to 1.
   */
  increaseNumberOfImagesBeingLoaded(increaseAmount: number = 1) {
    this._numberOfImagesBeingLoaded += increaseAmount
    this._numberOfImagesBeingLoaded$.next(this._numberOfImagesBeingLoaded)
  }

  /**
   * Decreases the number of images that are currently being loaded. This is useful for showing loading indicators.
   * @param decreaseAmount The amount by which to decrease the count. Defaults to 1.
   */
  decreaseNumberOfImagesBeingLoaded(decreaseAmount: number = 1) {
    this._numberOfImagesBeingLoaded -= decreaseAmount
    if (this._numberOfImagesBeingLoaded < 0) {
      this._numberOfImagesBeingLoaded = 0
    }
    this._numberOfImagesBeingLoaded$.next(this._numberOfImagesBeingLoaded)
  }

  /**
   * Resets the number of images being loaded to zero. This is useful when you want to reset the loading state.
   */
  resetNumberOfImagesBeingLoaded() {
    this._numberOfImagesBeingLoaded = 0
    this._numberOfImagesBeingLoaded$.next(this._numberOfImagesBeingLoaded)
  }

  /**
   * Returns an observable that emits the current image preview URLs.
   */
  get previewUrls$(): Observable<string[]> {
    return this._imagePreviewUrls$.asObservable()
  }

  /**
   * Returns an observable that emits the current number of images that are being loaded. Useful for showing loading
   * indicators.
   */
  get numberOfImagesBeingLoaded$(): Observable<number> {
    return this._numberOfImagesBeingLoaded$.asObservable()
  }

  /**
   * Returns the current list of files.
   */
  get files(): File[] {
    return [...this._files]
  }

  private async loadPreview(file: File) {
    const dataUrl = await this.readFileAsDataURL(file)
    this.addPreview(dataUrl)
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  private addPreview(preview: string) {
    console.log('Adding preview:', preview)
    this._imagePreviewUrls.push(preview)
    this._imagePreviewUrls$.next([...this._imagePreviewUrls])
  }
}
