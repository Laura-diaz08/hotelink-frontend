import { TestBed } from '@angular/core/testing';

import { TareaLimpieza } from './tarea-limpieza';

describe('TareaLimpieza', () => {
  let service: TareaLimpieza;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaLimpieza);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
