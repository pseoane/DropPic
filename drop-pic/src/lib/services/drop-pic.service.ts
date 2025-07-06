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
  private _files: File[] = []

  constructor() { }

  /**
   * Adds a new file to the service and loads its preview.
   * @param newFile
   */
  async addFile(newFile: File) {
    console.log('Adding file:', newFile.name)
    this._files.push(newFile)
    this.loadPreview(newFile)
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
   * Returns an observable that emits the current image preview URLs.
   */
  get previewUrls$(): Observable<string[]> {
    return this._imagePreviewUrls$.asObservable()
  }

  /**
   * Returns an observable that emits the number of images currently being loaded.
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

  private loadPreview(file: File) {
    console.log('Loading preview for file:', file.name)
    const reader = new FileReader()
    reader.onload = () => {
      this.addPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  private addPreview(preview: string) {
    console.log('Adding preview:', preview)
    this._imagePreviewUrls.push(preview)
    this._imagePreviewUrls$.next([...this._imagePreviewUrls])
  }
}
