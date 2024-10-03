import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaInfoComponent } from './cancha-info.component';

describe('CanchaInfoComponent', () => {
  let component: CanchaInfoComponent;
  let fixture: ComponentFixture<CanchaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchaInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanchaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
