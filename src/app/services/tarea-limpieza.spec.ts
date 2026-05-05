import { TestBed } from '@angular/core/testing';

import { TareaLimpiezaService } from './tarea-limpieza';

describe('TareaLimpiezaService', () => {
  let service: TareaLimpiezaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaLimpiezaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
