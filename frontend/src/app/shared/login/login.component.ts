import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
    ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  login() {
    const credentials = {
      userMail: this.email,
      userPassword: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.token = response.token;
          console.log('Token:', this.token);

          localStorage.setItem('token', this.token);

          this.successMessage = 'Login successful!';
          this.router.navigate(['/home']).then(() => this.dialogRef.close());
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your email and password.';
      }
    });
  }
}
