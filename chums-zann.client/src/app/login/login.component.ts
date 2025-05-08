import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule]
})
export class LoginComponent {
  service = inject(LoginService);
  router = inject(Router);
  loginMsg = signal("");

  username: string = "";
  password: string = "";

  loginClick() {

    if (this.username == "" || this.password == "") {
      alert("Username and password cannot be blank.");
      return;
    }

    this.service.validateLogin(this.username, this.password)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((res) => {
        if (res) {
          const jsonObj = JSON.parse(JSON.stringify(res));

          if (jsonObj.validated) {
            sessionStorage.setItem('user', this.username);
            sessionStorage.setItem('token', jsonObj.token);

            this.router.navigate(['/admin/dashboard']);
          } else {
            this.loginMsg.update((value) => (value = "Failed to login."));
          }
        } else {
          this.loginMsg.update((value) => (value = "Failed to login."));
        }
      });
  }
}
