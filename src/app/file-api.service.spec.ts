import { TestBed } from '@angular/core/testing';

import { FileAPIService } from './file-api.service';

describe('FileAPIService', () => {
  let service: FileAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
