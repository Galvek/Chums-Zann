import { Injectable, inject } from '@angular/core';
import { Merchandise } from '../model/merchandise.type';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  http = inject(HttpClient);

  getInventory(primCategory: number, subCategory: number) {
    const url = "/api/inventory/get?primCategory=" + primCategory + "&subCategory=" + subCategory;
    return this.http.get<Array<Merchandise>>(url);
  }

  getAllInventory() {
    return this.getInventory(0, 0);
  }

  addItem(merch: Merchandise) {
    const url = "/api/inventory/additem";
    return this.http.post<Merchandise>(url, merch);
  }

  editItem(merch: Merchandise) {
    const url = "/api/inventory/edititem";
    return this.http.post<Merchandise>(url, merch);
  }

  deleteItem(id: number) {
    const url = "/api/inventory/deleteitem";
    return this.http.post<Array<Merchandise>>(url, id);
  }
}
