import { Injectable, inject } from '@angular/core';
import { User } from '../model/user.type';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  getUsers() {
    //get all users
    const url = "/users/all";
    return this.http.get<Array<User>>(url);
  }

  getUser(id: number) {
    //get single user
    const url = "/users/userById";
    let params = new HttpParams()
      .set("id", id);
    return this.http.get<Array<User>>(url, { params });
  }

  createUser(username: string, password: string) {
    const url = "/users/create";
    let params = new HttpParams()
      .set("username", username)
      .set("password", password);
    return this.http.get(url, { params });
  }

  editUser(id: number, password: string) {
    const url = "/users/edit";
    let params = new HttpParams()
      .set("id", id)
      .set("password", password);
    return this.http.get(url, { params });
  }

  deleteUser(id: number) {
    const url = "/users/delete";
    let params = new HttpParams()
      .set("id", id);
    return this.http.get<Array<User>>(url, { params });
  }

  validateUser(username: string): boolean {
    return username.includes("@") && (username.substring(username.lastIndexOf('@') + 1).length > 0);
  }

  validatePass(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;
    return regex.test(password);
  }
}
