import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecMapaComponent } from './selec-mapa.component';

describe('SelecMapaComponent', () => {
  let component: SelecMapaComponent;
  let fixture: ComponentFixture<SelecMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelecMapaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelecMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
