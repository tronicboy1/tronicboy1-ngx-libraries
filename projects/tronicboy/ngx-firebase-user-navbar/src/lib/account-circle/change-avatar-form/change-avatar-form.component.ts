import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, map, Subject, takeUntil } from 'rxjs';
import { InheritableAccountDetailsComponent } from '../inheritable-account-details-component';

@Component({
  selector: 'app-change-avatar-form',
  templateUrl: './change-avatar-form.component.html',
  styleUrls: [
    './change-avatar-form.component.css',
    '../../../../../../../projects/tronicboy/ngx-base-components/styles/basic-form.css',
  ],
})
export class ChangeAvatarFormComponent extends InheritableAccountDetailsComponent implements AfterViewInit, OnDestroy {
  filename?: string;
  photoPreview?: string;
  readonly noFileNameText = $localize`Select Photo`;
  private teardown$ = new Subject<void>();

  @ViewChild('photoCanvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput')
  private fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage')
  private previewImage!: ElementRef<HTMLImageElement>;

  ngOnDestroy() {
    this.teardown$.next();
  }

  ngAfterViewInit(): void {
    if (!this.canvas) throw TypeError('Canvase element was not found.');
    if (!this.fileInput) throw TypeError('File Input was not found.');
    if (!this.previewImage) throw TypeError('Preview image element not found.');
    fromEvent(this.previewImage.nativeElement, 'load')
      .pipe(
        takeUntil(this.teardown$),
        map((event) => {
          const imgElement = event.target;
          if (!(imgElement instanceof HTMLImageElement)) throw TypeError();
          return imgElement;
        }),
      )
      .subscribe((imgElement) => {
        const context = this.canvas.nativeElement.getContext('2d');
        if (!context) throw Error('Unable to load context.');
        const { width, height } = this.canvas.nativeElement;
        context!.clearRect(0, 0, width, height);
        context.drawImage(imgElement, 0, 0, imgElement.naturalWidth, imgElement.naturalHeight, 0, 0, width, height);
        this.canvas.nativeElement.toBlob((blob) => {
          if (!blob) throw Error('No blob was generated');
          const file = new File([blob], 'img.png', {
            lastModified: Date.now(),
          });
          const transfer = new DataTransfer();
          transfer.items.add(file);
          this.fileInput.nativeElement.files = transfer.files;
        });
      });
  }

  public handleSubmit: EventListener = (event) => {
    const { formData } = InheritableAccountDetailsComponent.getFormData(event);
    const avatar = formData.get('avatar')!;
    if (!(avatar instanceof File)) throw TypeError('Avatar formdata should be file.');
    if (!avatar.size) return;
    this.loading = true;
    this.authService
      .updateAccount({}, avatar)
      .then(() => this.submitted.emit(null))
      .catch(console.error)
      .finally(() => (this.loading = false));
  };

  public handleFileInput: EventListener = (event) => {
    this.filename = undefined;
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) throw TypeError('This listener must be used with file input.');
    const { files } = input;
    if (!files) throw TypeError('Files were not associated with file input.');
    const photo = files[0];
    if (!photo.size) return;
    this.filename = photo.name;
    this.getImageDataURL(photo).then((dataURL) => (this.photoPreview = dataURL));
  };

  private getImageDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const { result } = reader;
        if (typeof result !== 'string') throw TypeError('Reader result type was incorrect.');
        return resolve(result);
      });

      reader.addEventListener('error', reject);

      reader.readAsDataURL(file);
    });
}
