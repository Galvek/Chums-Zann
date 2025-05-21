import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-merchandise-tile',
  templateUrl: './merchandise-tile.component.html',
  styleUrl: './merchandise-tile.component.scss',
  imports: [
    MatCardModule,
    MatChipsModule
  ]
})
export class MerchandiseTileComponent {
  @Input() item: any;
  @Output() updateInventory = new EventEmitter<any>();

}
