import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudanosConocerteComponent } from './ayudanos-conocerte.component';

describe('AyudanosConocerteComponent', () => {
  let component: AyudanosConocerteComponent;
  let fixture: ComponentFixture<AyudanosConocerteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AyudanosConocerteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AyudanosConocerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
