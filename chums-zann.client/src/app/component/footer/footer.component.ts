import { Component, AfterViewInit, Output, EventEmitter, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../services/category.service';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { catchError } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule
  ]
})
export class FooterComponent {
  year: number = new Date().getFullYear();

  @Output() updateInventory = new EventEmitter<any>();

  catService = inject(CategoryService);
  primCats: PrimaryCategory[] = [];

  showAddress: boolean = true;

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
            this.showAddress = false;
          } else {
            this.showAddress = true;
          }
        }
      });
  }

  ngAfterViewInit() {
    this.catService.getPrimaries()
      .pipe(
        catchError((err) => {

          throw err;
        }))
      .subscribe((cats) => {
        this.primCats = cats;
      });
  }

  onClick(primCategory: number, subCategory: number) {
    let categories = [primCategory, subCategory];
    this.updateInventory.emit(categories);
  }
}
