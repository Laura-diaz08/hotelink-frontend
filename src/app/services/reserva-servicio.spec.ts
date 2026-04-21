import { TestBed } from '@angular/core/testing';

import { ReservaServicio } from './reserva-servicio';

describe('ReservaServicio', () => {
  let service: ReservaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
