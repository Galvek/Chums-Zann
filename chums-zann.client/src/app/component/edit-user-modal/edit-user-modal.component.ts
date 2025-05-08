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
  selector: 'app-edit-user-modal',
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
    MatDialogClose],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {
  service = inject(UserService);
  readonly dialogRef = inject(MatDialogRef<EditUserModalComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  hide = true;

  id = signal(this.data.id);
  username = signal(this.data.username);
  password = signal('');

  saveResult = signal('');

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    let pass = this.password();

    if (!this.service.validatePass(pass)) {
      alert("Password must contain the following: \n"
        + "\t Atleast 1 Uppercase Letter \n"
        + "\t Atleast 1 Number \n"
        + "\t Atleast 1 Special Character \n"
        + "\t Minimum of 12 Characters");
      return;
    }

    this.service.editUser(this.data.id, pass)
      .pipe(
        catchError((err) => {
          this.saveResult.update((value) => "Failed to edit user.");
          throw err;
        }))
      .subscribe((res) => {
        if (res)
          this.close();
        else {
          this.saveResult.update((value) => "Failed to edit user.");
        }
      });
  }

  close() {
    //wipe form data
    this.password.update((value) => "");
    this.dialogRef.close();
  }
}
