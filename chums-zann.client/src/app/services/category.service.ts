import { Injectable, inject } from '@angular/core';
import { PrimaryCategory } from '../model/primaryCategory.type';
import { SubCategory } from '../model/subCategory.type';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http = inject(HttpClient);

  getPrimaries() {
    const url = "/api/categories/getprimaries";
    return this.http.get<Array<PrimaryCategory>>(url);
  }

  createPrimary(description: string) {
    const url = "/api/categories/createprimary";
    let params = new HttpParams()
      .set("description", description);
    return this.http.get(url, { params });
  }

  editPrimary(id: number, description: string) {
    const url = "/api/categories/editprimary";
    let params = new HttpParams()
      .set("id", id)
      .set("description", description);
    return this.http.get(url, { params });
  }

  deletePrimary(id: number) {
    const url = "/api/categories/deleteprimary";
    let params = new HttpParams()
      .set("id", id);
    return this.http.get<Array<PrimaryCategory>>(url, { params });
  }

  getSubs() {
    const url = "/api/categories/getsubs";
    return this.http.get<Array<SubCategory>>(url);
  }

  createSub(primId: number, description: string) {
    const url = "/api/categories/createsub";
    let params = new HttpParams()
      .set("primId", primId)
      .set("description", description);
    return this.http.get(url, { params });
  }

  editSub(id: number, primId: number, description: string) {
    const url = "/api/categories/editsub";
    let params = new HttpParams()
      .set("id", id)
      .set("primId", primId)
      .set("description", description);
    return this.http.get(url, { params });
  }

  deleteSub(id: number) {
    const url = "/api/categories/deletesub";
    let params = new HttpParams()
      .set("id", id);
    return this.http.get<Array<SubCategory>>(url, { params });
  }
}
