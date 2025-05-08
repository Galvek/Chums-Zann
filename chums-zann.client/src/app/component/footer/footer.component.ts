import { Component, AfterViewInit, Output, EventEmitter, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../services/category.service';
import { PrimaryCategory } from '../../model/primaryCategory.type';
import { catchError } from 'rxjs';

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
