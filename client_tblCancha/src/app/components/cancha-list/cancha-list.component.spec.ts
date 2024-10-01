import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaListComponent } from './cancha-list.component';

describe('CanchaListComponent', () => {
  let component: CanchaListComponent;
  let fixture: ComponentFixture<CanchaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanchaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
