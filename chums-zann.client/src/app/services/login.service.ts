import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);

  validateLogin(username: string, password: string) {
    const url = "/api/login/validate";
    let params = new HttpParams()
      .set("username", username)
      .set("password", password);
    return this.http.get(url, { params });
  }

  validateToken(username: string, token: string) {
    const url = "/api/login/validatetoken";
    let params = new HttpParams()
      .set("username", username)
      .set("token", token);
    return this.http.get(url, { params });
  }
}
