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
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { SubCategory } from '../../model/subCategory.type';
import { InventoryService } from '../../services/inventory.service';
import { CategoryService } from '../../services/category.service';
import { FileUploadService } from '../../services/fileupload.service';
import { catchError } from 'rxjs';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { NgFor } from '@angular/common';
import { Merchandise } from '../../model/merchandise.type';
import { MerchandiseTileComponent } from '../../component/merchandise-tile/merchandise-tile.component';

@Component({
  selector: 'app-edit-merch-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    NgFor,
    MerchandiseTileComponent],
  templateUrl: './edit-merch-modal.component.html',
  styleUrl: './edit-merch-modal.component.scss'
})
export class EditMerchModalComponent implements AfterViewInit {
  service = inject(InventoryService);
  catService = inject(CategoryService);
  uploadService = inject(FileUploadService);
  readonly dialogRef = inject(MatDialogRef<EditMerchModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  primCats: PrimaryCategory[] = [];
  subCats: SubCategory[] = [];

  merch: Merchandise = this.data.merch;

  fileToUpload: File = new File([], "empty.txt");

  saveResult = signal('');

  ngAfterViewInit() {
    this.catService.getPrimaries()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((cats) => {
        this.primCats = cats;
      });

    this.catService.getSubs()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((cats) => {
        this.subCats = cats;
      });
  }

  fileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];

    this.uploadService.uploadFile(this.fileToUpload)
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to upload image.");
          throw err;
        }))
      .subscribe((res) => {
        if (res) {
          this.merch.image = res.toString();
        }
        else
          this.saveResult.update((value) => "Failed to add item.");
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.service.editItem(this.merch)
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to edit item.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close();
        else
          this.saveResult.update((value) => "Failed to edit item.");
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
