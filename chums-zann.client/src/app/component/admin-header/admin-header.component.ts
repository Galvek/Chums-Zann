import { Component, OnInit, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatDividerModule, RouterLink, RouterLinkActive]
})
export class AdminHeaderComponent implements OnInit {
  username: any = sessionStorage.getItem('user');
  currUser = signal(this.username);
  token: any = sessionStorage.getItem('token');
  service = inject(LoginService);
  router = inject(Router);

  ngOnInit() {
    this.service.validateToken(this.username, this.token)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((res) => {
        if (!res) {
          this.router.navigate(['/login']);
        }
      });
  }

  logOutClick() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
