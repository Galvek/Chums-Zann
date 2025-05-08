import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrimaryCategoryModalComponent } from './edit-primary-category-modal.component';

describe('EditPrimaryCategoryModalComponent', () => {
  let component: EditPrimaryCategoryModalComponent;
  let fixture: ComponentFixture<EditPrimaryCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPrimaryCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrimaryCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
