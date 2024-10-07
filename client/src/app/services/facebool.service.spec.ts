import { TestBed } from '@angular/core/testing';

import { FaceboolService } from './facebool.service';

describe('FaceboolService', () => {
  let service: FaceboolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceboolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
