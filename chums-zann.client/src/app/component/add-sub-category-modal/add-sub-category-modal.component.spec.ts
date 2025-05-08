import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubCategoryModalComponent } from './add-sub-category-modal.component';

describe('AddSubCategoryModalComponent', () => {
  let component: AddSubCategoryModalComponent;
  let fixture: ComponentFixture<AddSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
