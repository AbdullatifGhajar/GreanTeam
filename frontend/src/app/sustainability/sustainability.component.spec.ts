import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustainabilityComponent } from './sustainability.component';

describe('SustainabilityComponent', () => {
  let component: SustainabilityComponent;
  let fixture: ComponentFixture<SustainabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SustainabilityComponent]
    });
    fixture = TestBed.createComponent(SustainabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
