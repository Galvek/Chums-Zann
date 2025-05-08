import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMerchModalComponent } from './edit-merch-modal.component';

describe('EditMerchModalComponent', () => {
  let component: EditMerchModalComponent;
  let fixture: ComponentFixture<EditMerchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMerchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMerchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
