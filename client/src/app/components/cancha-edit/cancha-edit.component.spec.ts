import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaEditComponent } from './cancha-edit.component';

describe('CanchaEditComponent', () => {
  let component: CanchaEditComponent;
  let fixture: ComponentFixture<CanchaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanchaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
