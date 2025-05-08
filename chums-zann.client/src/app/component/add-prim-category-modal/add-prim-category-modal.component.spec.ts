import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrimCategoryModalComponent } from './add-prim-category-modal.component';

describe('AddPrimCategoryModalComponent', () => {
  let component: AddPrimCategoryModalComponent;
  let fixture: ComponentFixture<AddPrimCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrimCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrimCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
