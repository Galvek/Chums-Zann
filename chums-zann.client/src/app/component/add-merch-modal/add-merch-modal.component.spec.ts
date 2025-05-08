import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMerchModalComponent } from './add-merch-modal.component';

describe('AddMerchModalComponent', () => {
  let component: AddMerchModalComponent;
  let fixture: ComponentFixture<AddMerchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMerchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMerchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
