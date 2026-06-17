import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../../security.service';

@Component({
  selector: 'app-sign-in-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.scss',
})
export class SignInPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(SecurityService);
  private readonly router = inject(Router);

  mode: 'signin' | 'signup' = 'signin';
  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.maxLength(10)]],
    mail: [''],
  });

  switchMode(mode: 'signin' | 'signup'): void {
    this.mode = mode;
    this.errorMessage = '';
    const mail = this.form.controls.mail;
    if (mode === 'signup') {
      mail.addValidators([Validators.required, Validators.email]);
    } else {
      mail.clearValidators();
      mail.setValue('');
    }
    mail.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const value = this.form.getRawValue();
    const request =
      this.mode === 'signin'
        ? this.service.signIn({
            username: value.username,
            password: value.password,
            googleHash: '',
            facebookHash: '',
            socialLogin: false,
          })
        : this.service.signUp({
            username: value.username,
            password: value.password,
            mail: value.mail,
            googleHash: '',
            facebookHash: '',
          });

    request.subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: (error) => {
        this.errorMessage = error.error?.code ?? 'Une erreur est survenue';
        this.loading = false;
      },
    });
  }
}
