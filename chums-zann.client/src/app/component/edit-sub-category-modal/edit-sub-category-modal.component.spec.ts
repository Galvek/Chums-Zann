import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubCategoryModalComponent } from './edit-sub-category-modal.component';

describe('EditSubCategoryModalComponent', () => {
  let component: EditSubCategoryModalComponent;
  let fixture: ComponentFixture<EditSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSubCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
