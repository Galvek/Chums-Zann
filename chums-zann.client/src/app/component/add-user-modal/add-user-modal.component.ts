import { Component, inject, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../model/user.type';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose]
})
export class AddUserModalComponent {
  service = inject(UserService);
  readonly dialogRef = inject(MatDialogRef<AddUserModalComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  hide = true;

  username = signal('');
  password = signal('');

  saveResult = signal('');

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    //use user service to create user
    let user = this.username();
    let pass = this.password();
    if (!this.service.validateUser(user)) {
      alert("Username must be a valid email address.");
      return;
    }

    if (!this.service.validatePass(pass)) {
      alert("Password must contain the following: \n"
        + "\t Atleast 1 Uppercase Letter \n"
        + "\t Atleast 1 Number \n"
        + "\t Atleast 1 Special Character \n"
        + "\t Minimum of 12 Characters");
      return;
    }

    this.service.createUser(user, pass)
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to create user.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close();
        else {
          this.saveResult.update((value) => "Failed to create user.");
        }
      });
  }

  close() {
    //wipe form data
    this.username.update((value) => "");
    this.password.update((value) => "");
    this.dialogRef.close();
  }
}
