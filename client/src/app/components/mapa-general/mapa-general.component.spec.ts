import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaGeneralComponent } from './mapa-general.component';

describe('MapaGeneralComponent', () => {
  let component: MapaGeneralComponent;
  let fixture: ComponentFixture<MapaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapaGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
