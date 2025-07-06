import { TestBed } from '@angular/core/testing';

import { DropPicService } from './drop-pic.service';

describe('DropPicService', () => {
  let service: DropPicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropPicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
