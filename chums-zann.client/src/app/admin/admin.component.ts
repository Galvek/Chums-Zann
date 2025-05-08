import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../component/admin-header/admin-header.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  imports: [RouterOutlet, AdminHeaderComponent]
})
export class AdminComponent {

}
