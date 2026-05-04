import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesAdmin } from './habitaciones-admin';

describe('HabitacionesAdmin', () => {
  let component: HabitacionesAdmin;
  let fixture: ComponentFixture<HabitacionesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitacionesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
