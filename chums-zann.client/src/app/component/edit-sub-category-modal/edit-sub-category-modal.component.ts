import { Component, AfterViewInit, inject, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SubCategory } from '../../model/subCategory.type';
import { CategoryService } from '../../services/category.service';
import { catchError } from 'rxjs';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-sub-category-modal',
  templateUrl: './edit-sub-category-modal.component.html',
  styleUrl: './edit-sub-category-modal.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    NgFor]
})
export class EditSubCategoryModalComponent implements AfterViewInit {
  service = inject(CategoryService);
  readonly dialogRef = inject(MatDialogRef<EditSubCategoryModalComponent>);
  readonly data = inject<SubCategory>(MAT_DIALOG_DATA);

  id = signal(this.data.id);
  description = signal(this.data.description);

  primCats: PrimaryCategory[] = [];
  selectedValue = signal(this.data.primaryCategory.id);

  saveResult = signal('');

  ngAfterViewInit() {
    this.service.getPrimaries()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((cats) => {
        this.primCats = cats;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.service.editSub(this.data.id, this.selectedValue(), this.description())
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to edit user.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close();
        else {
          this.saveResult.update((value) => "Failed to edit user.");
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
