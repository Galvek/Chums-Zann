import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTileComponent } from './merchandise-tile.component';

describe('MerchandiseTileComponent', () => {
  let component: MerchandiseTileComponent;
  let fixture: ComponentFixture<MerchandiseTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MerchandiseTileComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MerchandiseTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
