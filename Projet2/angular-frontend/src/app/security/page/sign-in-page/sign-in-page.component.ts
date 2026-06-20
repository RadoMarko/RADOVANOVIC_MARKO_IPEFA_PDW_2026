import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(SecurityService);
  private readonly router = inject(Router);
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  mode: 'signin' | 'signup' = 'signin';
  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(10)]],
    password: ['', [Validators.required]],
    mail: [''],
  });

  switchMode(mode: 'signin' | 'signup'): void {
    this.mode = mode;
    this.errorMessage = '';

    const mail = this.form.controls.mail;
    const password = this.form.controls.password;

    if (mode === 'signup') {
      mail.addValidators([Validators.required, Validators.email]);
      password.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(this.passwordPattern),
      ]);
    } else {
      mail.clearValidators();
      mail.setValue('');
      password.setValidators([Validators.required]);
    }

    mail.updateValueAndValidity();
    password.updateValueAndValidity();
  }

  submit(): void {
    this.errorMessage = '';

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      this.errorMessage = this.getFormErrorMessage();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    const username = value.username.trim();
    const mail = value.mail.trim();
    const request =
      this.mode === 'signin'
        ? this.service.signIn({
            username,
            password: value.password,
            googleHash: '',
            facebookHash: '',
            socialLogin: false,
          })
        : this.service.signUp({
            username,
            password: value.password,
            mail,
            googleHash: '',
            facebookHash: '',
          });

    request.subscribe({
      next: (response) => {
        if (!response.result) {
          this.errorMessage = this.getApiErrorMessage(response.code);
          this.loading = false;
          this.changeDetector.detectChanges();
          return;
        }

        this.loading = false;
        this.changeDetector.detectChanges();
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.errorMessage =
          error.name === 'TimeoutError'
            ? "L'API ne répond pas. Vérifie que le serveur NestJS est bien lancé."
            : this.getApiErrorMessage(this.getErrorCode(error.error));
        this.loading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  private getFormErrorMessage(): string {
    const password = this.form.controls.password;
    const mail = this.form.controls.mail;

    if (this.mode === 'signup' && mail.invalid) {
      return 'Merci de saisir une adresse e-mail valide.';
    }

    if (this.mode === 'signup' && password.invalid) {
      return 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.';
    }

    return 'Merci de compléter les champs obligatoires.';
  }

  private getApiErrorMessage(code?: string): string {
    return (
      {
        MAIL_ALREADY_EXIST: 'Adresse e-mail déjà utilisée.',
        USER_ALREADY_EXIST: "Nom d'utilisateur déjà utilisé.",
        USER_NOT_FOUND: "Nom d'utilisateur ou mot de passe incorrect.",
        PASSWORD_LENGTH: 'Le mot de passe doit contenir entre 8 et 50 caractères.',
        PASSWORD_MATCHES:
          'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.',
        PAYLOAD_IS_NOT_VALID: 'Les informations saisies ne sont pas valides.',
        SIGNUP_ERROR: 'Création du compte impossible.',
      }[code ?? ''] ?? 'Une erreur est survenue.'
    );
  }

  private getErrorCode(error?: { code?: string; data?: string[] }): string {
    return error?.data?.[0] ?? error?.code ?? '';
  }
}
