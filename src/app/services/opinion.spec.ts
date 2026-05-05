import { TestBed } from '@angular/core/testing';

import { OpinionService } from './opinion';

describe('OpinionService', () => {
  let service: OpinionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpinionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
