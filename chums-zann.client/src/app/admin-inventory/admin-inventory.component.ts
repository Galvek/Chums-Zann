import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { CategoryService } from '../services/category.service';
import { catchError } from 'rxjs';
import { Merchandise } from '../model/merchandise.type';
import { PrimaryCategory } from '../model/primaryCategory.type';
import { SubCategory } from '../model/subCategory.type';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { AddMerchModalComponent } from '../component/add-merch-modal/add-merch-modal.component';
import { EditMerchModalComponent } from '../component/edit-merch-modal/edit-merch-modal.component';
import { AddPrimCategoryModalComponent } from '../component/add-prim-category-modal/add-prim-category-modal.component';
import { EditPrimaryCategoryModalComponent } from '../component/edit-primary-category-modal/edit-primary-category-modal.component';
import { AddSubCategoryModalComponent } from '../component/add-sub-category-modal/add-sub-category-modal.component';
import { EditSubCategoryModalComponent } from '../component/edit-sub-category-modal/edit-sub-category-modal.component';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.scss',
  imports: [
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule]
})
export class AdminInventoryComponent implements AfterViewInit {
  invColumns: string[] = ['position','name','description','price','quantity','primCategory','subCategory','onsale','outofstock','saleprice','actions'];
  invSerivce = inject(InventoryService);
  inventory: Merchandise[] = [];

  catService = inject(CategoryService);

  primCatColumns: string[] = ['position', 'description', 'actions'];
  primCats: PrimaryCategory[] = [];

  subCatColumns: string[] = ['position', 'primCatDesc', 'description', 'actions']
  subCats: SubCategory[] = [];

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.getInventory();
    this.getPrimCategories();
    this.getSubCategories();
  }

  // #region Inventory
  getInventory(): void {
    this.invSerivce.getAllInventory()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((items) => {
        this.inventory = items;
      });
  }

  openNewMerchDialog(): void {
    const addMerchDialog = this.dialog.open(
      AddMerchModalComponent,
      { maxWidth: '100vw', data: { }}
    );

    addMerchDialog.updateSize('650px', '700px');

    addMerchDialog.afterClosed().subscribe(result => {
      this.getInventory();
    });
  }

  onInvActionChange(event: MatSelectChange, merch: Merchandise): void {
    switch (event.value) {
      case 1: //edit
        this.openInvEditDialog(merch)
        break;
      case 2: //delete
        if (confirm("Are you sure you want to delete this item?")) this.deleteInvItem(merch.id);
        break;
    }
  }

  openInvEditDialog(merch: Merchandise): void {
    const editPrimCatDialog = this.dialog.open(
      EditMerchModalComponent,
      { maxWidth: '100vw', data: { merch } }
    );

    editPrimCatDialog.updateSize('650px', '700px');

    editPrimCatDialog.afterClosed().subscribe(result => {
      this.getInventory();
    });
  }

  deleteInvItem(id: number) {
    this.invSerivce.deleteItem(id)
      .pipe(
        catchError((err) => {
          throw err;
        }))
      .subscribe((items) => {
        this.inventory = items;
      });
  }
  // #endregion

  // #region Primary Category
  getPrimCategories(): void {
    this.catService.getPrimaries()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((cats) => {
        this.primCats = cats;
      });
  }

  openNewPrimCatDialog(): void {
    const addPrimCatDialog = this.dialog.open(
      AddPrimCategoryModalComponent,
      { width: '300px', height: '500px', data: { }}
    );

    addPrimCatDialog.afterClosed().subscribe(result => {
      this.getPrimCategories();
    });
  }

  openPrimCatEditDialog(id: number, desc: string): void {
    const editPrimCatDialog = this.dialog.open(
      EditPrimaryCategoryModalComponent,
      { width: '300px', height: '500px', data: { id: id, description: desc } }
    );

    editPrimCatDialog.afterClosed().subscribe(result => {
      this.getPrimCategories();
    });
  }

  onPrimCatActionChange(event: MatSelectChange, id: number, desc: string): void {
    switch (event.value) {
      case 1: //edit
        this.openPrimCatEditDialog(id, desc);
        break;
      case 2: //delete
        if (confirm("Are you sure you want to delete this primary category?")) this.deletePrimary(id);
        break;
    }
  }

  deletePrimary(id: number): void {
    this.catService.deletePrimary(id)
      .pipe(
        catchError((err) => {
          throw err;
        }))
      .subscribe((cats) => {
        this.primCats = cats;
      });
  }
  // #endregion

  // #region Sub Category
  getSubCategories(): void {
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

  openNewSubCatDialog(): void {
    const addSubCatDialog = this.dialog.open(
      AddSubCategoryModalComponent,
      { width: '300px', height: '500px', data: { }}
    );

    addSubCatDialog.afterClosed().subscribe(result => {
      this.getSubCategories();
    });
  }

  openSubCatEditDialog(id: number, primaryCategory: PrimaryCategory, desc: string): void {
    const editSubCatDialog = this.dialog.open(
      EditSubCategoryModalComponent,
      { width: '300px', height: '500px', data: { id: id, primaryCategory: primaryCategory, description: desc } }
    );

    editSubCatDialog.afterClosed().subscribe(result => {
      this.getSubCategories();
    });
  }

  onSubCatActionChange(event: MatSelectChange, id: number, primaryCategory: PrimaryCategory, desc: string): void {
    switch (event.value) {
      case 1: //edit
        this.openSubCatEditDialog(id, primaryCategory, desc);
        break;
      case 2: //delete
        if (confirm("Are you sure you want to delete this sub category?")) this.deleteSub(id);
        break;
    }
  }

  deleteSub(id: number): void {
    this.catService.deleteSub(id)
      .pipe(
        catchError((err) => {
          throw err;
        }))
      .subscribe((cats) => {
        this.subCats = cats;
      });
  }
  // #endregion
}
