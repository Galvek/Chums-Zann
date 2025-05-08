import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  http = inject(HttpClient);

  uploadFile(file: File) {
    const url = "/fileupload/save";

    let formData = new FormData();
    formData.append("image", file);

    return this.http.post(url, formData);
  }

}
