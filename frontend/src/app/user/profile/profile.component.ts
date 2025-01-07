import { Component, NgModule, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormField, MatLabel, MatFormFieldControl } from '@angular/material/form-field';
import { ProfileService } from '../../services/profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-profile',
    imports: [MatTabsModule, MatFormField, MatLabel, FormsModule, ReactiveFormsModule, MatInputModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user?: User;
  currentPassword: string = '';
  newPassword: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.user = user;
    });
  }

  changePassword(): void {
    this.profileService.changePassword(this.currentPassword, this.newPassword).subscribe(response => {
      console.log('Şifre başarıyla değiştirildi', response);
    }, error => {
      console.error('Şifre değiştirilemedi', error);
    });
  }
}
