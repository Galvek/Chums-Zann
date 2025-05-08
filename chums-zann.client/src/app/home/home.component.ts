import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Merchandise } from '../model/merchandise.type';
import { catchError } from 'rxjs';
import { NgFor } from '@angular/common';
import { MerchandiseTileComponent } from '../component/merchandise-tile/merchandise-tile.component';
import { HeaderComponent } from '../component/header/header.component';
import { FooterComponent } from '../component/footer/footer.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [NgFor, MerchandiseTileComponent, HeaderComponent, FooterComponent, MatGridListModule]
})
export class HomeComponent implements AfterViewInit {
  service = inject(InventoryService);
  /*inventory = signal<Array<Merchandise>>([]);*/
  inventory: Merchandise[] = [];

  cols: number = 7;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = 2;
          } else if (result.breakpoints[Breakpoints.Small]) {
            this.cols = 3;
          } else if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = 4;
          } else if (result.breakpoints[Breakpoints.Large]) {
            this.cols = 6;
          } else {
            this.cols = 7;
          }
        }
      });
  }

  ngAfterViewInit() {
    this.changeLiqourCategory([0, 0]);
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
      });
  }
}
