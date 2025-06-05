import { Component, AfterViewInit, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../services/category.service';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { catchError } from 'rxjs';

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
