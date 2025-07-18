import { Component, AfterViewInit, inject, signal, HostListener, ViewChild } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Merchandise } from '../model/merchandise.type';
import { PrimaryCategory } from '../model/primaryCategory.type';
import { SubCategory } from '../model/subCategory.type';
import { catchError } from 'rxjs';
import { NgFor } from '@angular/common';
import { MerchandiseTileComponent } from '../component/merchandise-tile/merchandise-tile.component';
import { HeaderComponent } from '../component/header/header.component';
import { FooterComponent } from '../component/footer/footer.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { CategoryService } from '../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { BannerSliderComponent } from '../component/banner-slider/banner-slider.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

type MinMaxPrice = {
  minPrice: number;
  maxPrice: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    NgFor,
    MerchandiseTileComponent,
    HeaderComponent,
    FooterComponent,
    MatGridListModule,
    MatListModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectionList,
    BannerSliderComponent,
    MatIconModule,
    MatFormFieldModule]
})
export class HomeComponent implements AfterViewInit {
  service = inject(InventoryService);
  catService = inject(CategoryService);

  backToTop = inject(MatSnackBar);
  backToTopOpen: boolean = false;

  origInv: Merchandise[] = [];
  inventory: Merchandise[] = [];
  primCats: PrimaryCategory[] = [];
  subCats: SubCategory[] = [];

  minSliderValue: number = 0;
  minPrice: number = 0;
  maxSliderValue: number = 0;
  maxPrice: number = 0;

  @ViewChild('prims') prims!: MatSelectionList;
  @ViewChild('subs') subs!: MatSelectionList;

  isMobileView: boolean = false;
  showMobileFilterContainer: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.Handset]
            || result.breakpoints[Breakpoints.HandsetLandscape]
            || result.breakpoints[Breakpoints.HandsetPortrait]
            || result.breakpoints[Breakpoints.Tablet]
            || result.breakpoints[Breakpoints.TabletLandscape]
            || result.breakpoints[Breakpoints.TabletPortrait]) {
            this.isMobileView = true;
          } else {
            this.isMobileView = false;
          }
        }
      });
  }

  ngAfterViewInit() {
    this.changeLiqourCategory([0, 0]);

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

    this.service.getMinMaxPrice()
      .pipe(
        catchError((err) => {
          throw err;
        }))
      .subscribe((prices) => {
        let minMaxPrice = (prices as MinMaxPrice);
        this.minPrice = minMaxPrice.minPrice;
        this.maxPrice = minMaxPrice.maxPrice;
        this.minSliderValue = this.minPrice;
        this.maxSliderValue = this.maxPrice;
      });
  }

  changeLiqourCategory(categories: any) {
    this.service.getInventory(categories[0], categories[1])
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((items) => {
        this.inventory = items;
        this.origInv = this.inventory;
      });
  }

  getProductCount(primCat: number, subCat: number): number {
    try {
      if (primCat === 0)
        return this.inventory.reduce((count, item) => ((item.subCategory.id === subCat) ? count + 1 : count), 0);

      if (subCat === 0)
        return this.inventory.reduce((count, item) => ((item.primCategory.id === primCat) ? count + 1 : count), 0);

      return this.inventory.reduce((count, item) => ((item.primCategory.id === primCat && item.subCategory.id === subCat) ? count + 1 : count), 0);
    }
    catch {
      return 0;
    }
  }

  getSubCategoriesByPrimary(primCat: number): SubCategory[] {
    try {
      return this.subCats.filter((cat) => cat.primaryCategory.id === primCat);
    }
    catch {
      return [];
    }
  }

  selectPrimaryFilter() {
    this.prims.selectedOptions.selected.forEach((selectedItem) => {
      this.subs.options.filter((cat) => cat.value.primaryCategory.id === selectedItem.value.id).forEach((cat) => {
        cat.selected = true;
      })
    });

    //de-select all sub categories foreach unselected primary categories
    this.prims.options.filter((cat) => !cat.selected).forEach((cat) => {
      this.subs.selectedOptions.selected.filter((cat) => cat.value.primaryCategory.id === cat.value.primaryCategory.id).forEach((cat) => {
        cat.selected = false;
      })
    });

    this.applyFilter();
  }

  selectSubFilter() {
    this.subs.selectedOptions.selected.forEach((selectedItem) => {
      //select each primary category that has a match the the sub categories primary category
      this.prims.options.filter((cat) => cat.value.id === selectedItem.value.id).forEach((cat) => {
        cat.selected = true;
      })
    });

    this.applyFilter();
  }

  @HostListener('window:scroll', ['$event'])
  getScrollHeight(event: any) {
    if (window.pageYOffset > 200 && !this.backToTopOpen) {
      this.openBackToTop("Back to the top.", "Click");
    } else if (window.pageYOffset == 0) {
      this.backToTopOpen = false;
      this.backToTop.dismiss();
    }
  }

  openBackToTop(message: string, action: string) {
    let ref = this.backToTop.open(message, action);
    ref.onAction().subscribe(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      ref.dismiss();
    });
    this.backToTopOpen = true;
  }

  priceSliderValueChanged(event: any) {
    if (event.source.thumbPosition === 1) {
      this.minSliderValue = event.value;
    } else {
      this.maxSliderValue = event.value;
    }

    this.applyFilter();
  }

  setMinSliderValue(event: any) {
    let ele = event.target as HTMLInputElement;
    this.minSliderValue = parseFloat(ele.value);
  }

  setMaxSliderValue(event: any) {
    let ele = event.target as HTMLInputElement;
    this.maxSliderValue = parseFloat(ele.value);
  }

  applyFilter() {
    //apply primary category selection filter
    if (this.prims.selectedOptions.selected.length > 0) {
      this.inventory = [];
      this.prims.selectedOptions.selected.forEach((selectedItem) => {
        let merch: Merchandise[] = this.origInv.filter((item) => item.primCategory.id === selectedItem.value.id);
        merch.forEach((value) => {
          this.inventory.push(value)
        });
      });
    } else {
      this.inventory = this.origInv;
    }

    //apply sub category selection filter
    if (this.subs.selectedOptions.selected.length > 0) {
      this.inventory = [];
      this.subs.selectedOptions.selected.forEach((selectedItem) => {
        let merch: Merchandise[] = this.origInv.filter((item) => item.subCategory.id === selectedItem.value.id);
        merch.forEach((value) => {
          this.inventory.push(value)
        });
      });
    } else {
      this.inventory = this.origInv;
    }

    //apply pricing filter
    this.inventory = this.origInv.filter((item) =>
      item.onSale
        ? item.salePrice >= this.minSliderValue && item.salePrice <= this.maxSliderValue
        : item.price >= this.minSliderValue && item.price <= this.maxSliderValue
    );
  }

  resetFilter() {
    this.inventory = this.origInv;
    this.minSliderValue = this.minPrice;
    this.maxSliderValue = this.maxPrice;

    this.prims.options.forEach((cat) => {
      cat.selected = false;
    });

    this.subs.options.forEach((cat) => {
      cat.selected = false;
    });
  }

  toggleFilterContainer() {
    this.showMobileFilterContainer = !this.showMobileFilterContainer;
  }
}
