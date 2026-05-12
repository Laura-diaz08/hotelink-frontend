import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorDashboardComponent } from './trabajador-dashboard';

describe('TrabajadorDashboardComponent', () => {
  let component: TrabajadorDashboardComponent;
  let fixture: ComponentFixture<TrabajadorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajadorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabajadorDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
