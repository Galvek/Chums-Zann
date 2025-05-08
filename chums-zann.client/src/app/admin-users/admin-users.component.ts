import { Component, AfterViewInit, signal, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';
import { catchError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddUserModalComponent } from '../component/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from '../component/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  imports: [
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule]
})
export class AdminUsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'username', 'password', 'actions'];

  service = inject(UserService);
  users: User[] = [];

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.service.getUsers()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }))
      .subscribe((users) => {
        this.users = users;
      });
  }

  openDialog(): void {
    const addUserDialog = this.dialog.open(
      AddUserModalComponent,
      { width: '300px', height: '500px', data: {} });

    addUserDialog.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

  openEditDialog(userId: number, name: string): void {
    const editUserDialog = this.dialog.open(
      EditUserModalComponent,
      { width: '300px', height: '500px', data: { id: userId, username: name }}
    )
  }

  onActionChange(event: MatSelectChange, userId: number, username: string): void {
    switch (event.value) {
      case 1: //edit
        this.openEditDialog(userId, username);
        break;
      case 2: //delete
        if (confirm("Are you sure you want to delete this user?")) this.deleteUser(userId);
        break;
    }
  }

  deleteUser(id: number): void {
    this.service.deleteUser(id)
      .pipe(
        catchError((err) => {
          throw err;
        }))
      .subscribe((users) => {
        this.users = users;
      });
  }
}
