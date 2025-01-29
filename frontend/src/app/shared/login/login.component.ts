import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { FavoritesService } from '../../services/favorites.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
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
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  matcher = new MyErrorStateMatcher();

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    private favoritesService: FavoritesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  login() {
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

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
          this.favoritesService.createDefault().subscribe({
            next: (response: any) => {
              console.log(response.message);
            },
            error: (error) => console.error('Error creating/checking favorites:', error)
          });
          this.successMessage = 'Login successful!';
          this.router.navigate(['/home']).then(() => this.dialogRef.close());
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Email not found. Please check your email.';
        } else if (error.status === 401) {
          this.errorMessage = 'Incorrect password. Please try again.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again later.';
        }
      }
    });
  }
}
