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
  selector: 'app-edit-primary-category-modal',
  templateUrl: './edit-primary-category-modal.component.html',
  styleUrl: './edit-primary-category-modal.component.scss',
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
    MatDialogClose]
})
export class EditPrimaryCategoryModalComponent {
  service = inject(CategoryService);
  readonly dialogRef = inject(MatDialogRef<EditPrimaryCategoryModalComponent>);
  readonly data = inject<PrimaryCategory>(MAT_DIALOG_DATA);

  id = signal(this.data.id);
  description = signal(this.data.description);

  saveResult = signal('');

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.service.editPrimary(this.data.id, this.description())
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
