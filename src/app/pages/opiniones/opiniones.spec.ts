import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionesComponent } from './opiniones';

describe('OpinionesComponent', () => {
  let component: OpinionesComponent;
  let fixture: ComponentFixture<OpinionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
