import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimpiezaAdmin } from './limpieza-admin';

describe('LimpiezaAdmin', () => {
  let component: LimpiezaAdmin;
  let fixture: ComponentFixture<LimpiezaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimpiezaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimpiezaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
