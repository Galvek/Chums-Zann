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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Merchandise } from '../../model/merchandise.type';
import { InventoryService } from '../../services/inventory.service';
import { CategoryService } from '../../services/category.service';
import { FileUploadService } from '../../services/fileupload.service';
import { catchError } from 'rxjs';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { SubCategory } from '../../model/subCategory.type';
import { MerchandiseTileComponent } from '../../component/merchandise-tile/merchandise-tile.component';


@Component({
  selector: 'app-add-merch-modal',
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
    MerchandiseTileComponent],
  templateUrl: './add-merch-modal.component.html',
  styleUrl: './add-merch-modal.component.scss'
})
export class AddMerchModalComponent {
  service = inject(InventoryService);
  catService = inject(CategoryService);
  uploadService = inject(FileUploadService);
  readonly dialogRef = inject(MatDialogRef<AddMerchModalComponent>);
  readonly data = inject<Merchandise>(MAT_DIALOG_DATA);

  primCats: PrimaryCategory[] = [];
  subCats: SubCategory[] = [];

  merch: Merchandise = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    image: "",
    primCategory: {
      id: 0,
      description: ""
    },
    subCategory: {
      id: 0,
      primaryCategory: {
        id: 0,
        description: ""
      },
      description: ""
    },
    onSale: false,
    outOfStock: false,
    salePrice: 0,
    saleDescription: ""
  };

  fileToUpload: File = new File([], "empty.txt");

  saveResult = signal('');

  constructor() {
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

  primCatChange(event: MatSelectChange) {
    var cat = this.primCats.find(c => c.id == event.value);
    if (cat) {
      this.merch.primCategory = {
        id: cat.id,
        description: cat.description
      }
    }
  }

  subCatChange(event: MatSelectChange) {
    var cat = this.subCats.find(c => c.id == event.value);
    if (cat) {
      this.merch.subCategory = {
        id: cat.id,
        primaryCategory: {
          id: this.merch.primCategory.id,
          description: this.merch.primCategory.description
        },
        description: cat.description
      }
    }
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

  save() {
    this.service.addItem(this.merch)
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to add item.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close();
        else
          this.saveResult.update((value) => "Failed to add item.");
      });
  }

  close() {
    this.dialogRef.close();
  }
}
