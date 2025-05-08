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
  selector: 'app-add-sub-category-modal',
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
    NgFor],
  templateUrl: './add-sub-category-modal.component.html',
  styleUrl: './add-sub-category-modal.component.scss'
})
export class AddSubCategoryModalComponent implements AfterViewInit {
  service = inject(CategoryService);
  readonly dialogRef = inject(MatDialogRef<AddSubCategoryModalComponent>);
  readonly data = inject<SubCategory>(MAT_DIALOG_DATA);

  primCats: PrimaryCategory[] = [];
  selectedValue: number = 0;

  description = signal('');
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

  save() {
    this.service.createSub(this.selectedValue, this.description())
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to create user.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close()
        else
          this.saveResult.update((value) => "Failed to create user.");
      });
  }

  close() {
    this.dialogRef.close();
  }
}
