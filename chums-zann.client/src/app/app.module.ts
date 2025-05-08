import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MerchandiseTileComponent } from './component/merchandise-tile/merchandise-tile.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AdminHeaderComponent } from './component/admin-header/admin-header.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AddUserModalComponent } from './component/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from './component/edit-user-modal/edit-user-modal.component';
import { EditSubCategoryModalComponent } from './component/edit-sub-category-modal/edit-sub-category-modal.component';
import { EditPrimaryCategoryModalComponent } from './component/edit-primary-category-modal/edit-primary-category-modal.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    MerchandiseTileComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    AdminHeaderComponent,
    AdminDashboardComponent,
    AdminInventoryComponent,
    AdminUsersComponent,
    AddUserModalComponent, //may not even need to include some of these here, as they're standalone and included in the specific components as needed
    EditUserModalComponent,
    EditSubCategoryModalComponent,
    EditPrimaryCategoryModalComponent],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
