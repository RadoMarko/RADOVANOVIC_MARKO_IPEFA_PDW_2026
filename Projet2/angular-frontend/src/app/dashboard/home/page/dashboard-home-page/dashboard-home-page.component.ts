import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SecurityService } from '../../../../security/security.service';

@Component({
  selector: 'app-dashboard-home-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss',
})
export class DashboardHomePageComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  loading = true;
  passwordLoading = false;
  tokenLoading = false;
  passwordDialogOpen = false;
  errorMessage = '';
  passwordErrorMessage = '';
  passwordSuccessMessage = '';
  tokenErrorMessage = '';
  tokenSuccessMessage = '';

  readonly passwordForm = this.formBuilder.nonNullable.group({
    oldPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(this.passwordPattern),
      ],
    ],
  });

  constructor(
    readonly service: SecurityService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.service.me().subscribe({
      next: () => {
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.errorMessage = this.getApiErrorMessage(this.getErrorCode(error.error));
        this.loading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  openPasswordDialog(): void {
    this.passwordDialogOpen = true;
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';
  }

  closePasswordDialog(): void {
    if (this.passwordLoading) {
      return;
    }

    this.passwordDialogOpen = false;
    this.passwordForm.reset();
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';
  }

  changePassword(): void {
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';

    if (this.passwordForm.invalid || this.passwordLoading) {
      this.passwordForm.markAllAsTouched();
      this.passwordErrorMessage =
        'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.';
      return;
    }

    this.passwordLoading = true;
    this.service.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: (response) => {
        this.passwordLoading = false;
        if (!response.result) {
          this.passwordErrorMessage = this.getApiErrorMessage(response.code);
          this.changeDetector.detectChanges();
          return;
        }

        this.passwordForm.reset();
        this.passwordSuccessMessage = 'Mot de passe modifié.';
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.passwordErrorMessage =
          error.name === 'TimeoutError'
            ? "L'API ne répond pas. Vérifie que le serveur NestJS est bien lancé."
            : this.getApiErrorMessage(this.getErrorCode(error.error));
        this.passwordLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  refreshTokens(): void {
    if (this.tokenLoading) {
      return;
    }

    this.tokenLoading = true;
    this.tokenErrorMessage = '';
    this.tokenSuccessMessage = '';
    this.service.refresh().subscribe({
      next: (response) => {
        this.tokenLoading = false;
        if (!response.result) {
          this.tokenErrorMessage = this.getApiErrorMessage(response.code);
          this.changeDetector.detectChanges();
          return;
        }

        this.tokenSuccessMessage = 'Token actualisé.';
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.tokenErrorMessage =
          error.name === 'TimeoutError'
            ? "L'API ne répond pas. Vérifie que le serveur NestJS est bien lancé."
            : this.getApiErrorMessage(this.getErrorCode(error.error));
        this.tokenLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  logout(): void {
    this.service.logout();
    void this.router.navigateByUrl('/');
  }

  private getApiErrorMessage(code?: string): string {
    return (
      {
        OLD_PASSWORD_INVALID: 'Ancien mot de passe incorrect.',
        PASSWORD_CHANGE_ERROR: 'Modification du mot de passe impossible.',
        PASSWORD_LENGTH: 'Le mot de passe doit contenir entre 8 et 50 caractères.',
        PASSWORD_MATCHES:
          'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.',
        PAYLOAD_IS_NOT_VALID: 'Les informations saisies ne sont pas valides.',
        TOKEN_EXPIRED: 'Session expirée.',
        USER_NOT_FOUND: 'Utilisateur introuvable.',
      }[code ?? ''] ?? 'Une erreur est survenue.'
    );
  }

  private getErrorCode(error?: { code?: string; data?: string[] }): string {
    return error?.data?.[0] ?? error?.code ?? '';
  }
}
