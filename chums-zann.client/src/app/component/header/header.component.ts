import { Component, AfterViewInit, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../services/category.service';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { catchError } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule]
})
export class HeaderComponent {
  @Output() updateInventory = new EventEmitter<any>();

  catService = inject(CategoryService);
  primCats: PrimaryCategory[] = [];

  showSlimHeader: boolean = false;
  isMobileView: boolean = false;

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

  @HostListener('window:scroll', ['$event'])
  getScrollHeight(event: any) {
    if (window.pageYOffset > 300) {
      this.showSlimHeader = true;
    } else if (window.pageYOffset <= 300) {
      this.showSlimHeader = false;
    }
  }
}
