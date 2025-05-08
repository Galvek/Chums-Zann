import { Component, inject, signal, model } from '@angular/core';
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
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { CategoryService } from '../../services/category.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-add-prim-category-modal',
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
    MatDialogClose],
  templateUrl: './add-prim-category-modal.component.html',
  styleUrl: './add-prim-category-modal.component.scss'
})
export class AddPrimCategoryModalComponent {
  service = inject(CategoryService);
  readonly dialogRef = inject(MatDialogRef<AddPrimCategoryModalComponent>);
  readonly data = inject<PrimaryCategory>(MAT_DIALOG_DATA);

  description = signal('');
  saveResult = signal('');

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.service.createPrimary(this.description())
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
