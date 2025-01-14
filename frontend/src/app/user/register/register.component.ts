import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        ReactiveFormsModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  nameFormControl = new FormControl('', [Validators.required]);
  surnameFormControl = new FormControl('', [Validators.required]);
  tcFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  name: string = '';
  surname: string = '';
  tc: string = '';
  email: string = '';
  tel: string = '';
  password: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) { }

  register() {

    if (
      this.nameFormControl.invalid ||
      this.surnameFormControl.invalid ||
      this.tcFormControl.invalid ||
      this.emailFormControl.invalid ||
      this.telFormControl.invalid ||
      this.passwordFormControl.invalid ||
      this.confirmPasswordFormControl.invalid
    ) {
      this.errorMessage = 'Lütfen tüm alanları doğru doldurun.';
      return;
    }

    if (this.passwordFormControl.value !== this.confirmPasswordFormControl.value) {
      this.errorMessage = 'Şifreler uyuşmuyor.';
      return;
    }
    const user = {
      userName: this.name,
      userSurname: this.surname,
      userTC: this.tc,
      userMail: this.email,
      userTel: this.tel,
      userPassword: this.password
    };

    this.authService.register(user).subscribe({
      next: (response: any) => {
        if (response.message === "User registered successfully") {
          this.successMessage = 'registration success';
          this.router.navigate(['/login']).then(() => this.dialogRef.close());
        } else {
          this.errorMessage = 'Registration failure.';
        }
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failure.';
      }
    });
  }
}
