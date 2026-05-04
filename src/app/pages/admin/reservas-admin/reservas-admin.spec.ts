import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasAdminComponent } from './reservas-admin';

describe('Reservas', () => {
  let component: ReservasAdminComponent;
  let fixture: ComponentFixture<ReservasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
