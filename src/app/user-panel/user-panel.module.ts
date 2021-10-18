import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    AdminPanelComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserPanelModule { }
