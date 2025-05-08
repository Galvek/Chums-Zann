import { TestBed } from '@angular/core/testing';

import { FileUploadService } from './fileupload.service';

describe('FileuploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
