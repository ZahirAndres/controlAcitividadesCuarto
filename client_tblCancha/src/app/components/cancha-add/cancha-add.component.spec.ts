import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaAddComponent } from './cancha-add.component';

describe('CanchaAddComponent', () => {
  let component: CanchaAddComponent;
  let fixture: ComponentFixture<CanchaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchaAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanchaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
