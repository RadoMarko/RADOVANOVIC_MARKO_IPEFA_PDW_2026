import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudyStatus } from '../../model';
import { StudyService } from '../../study.service';

@Component({
  selector: 'app-study-create-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './study-create-page.component.html',
  styleUrl: './study-create-page.component.scss',
})
export class StudyCreatePageComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly minDate = '1950-01-01';
  readonly maxDate = this.todayInputValue();
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly statuses = Object.values(StudyStatus);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    startDate: [''],
    endDate: [''],
    status: [StudyStatus.DRAFT, [Validators.required]],
  });

  constructor(
    private readonly router: Router,
    private readonly service: StudyService,
  ) {}

  create(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dateError = this.validateDates();
    if (dateError.length > 0) {
      this.errorMessage.set(dateError);
      return;
    }

    this.loading.set(true);
    this.service.create(this.normalizePayload()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errorMessage.set(this.errorLabel(response.code));
          this.loading.set(false);
          return;
        }

        void this.router.navigateByUrl('/dashboard/studies');
      },
      error: (error) => {
        this.errorMessage.set(this.errorLabel(error.error?.code));
        this.loading.set(false);
      },
    });
  }

  statusLabel(status: StudyStatus): string {
    return {
      [StudyStatus.DRAFT]: 'Brouillon',
      [StudyStatus.ACTIVE]: 'Active',
      [StudyStatus.CLOSED]: 'Clôturée',
      [StudyStatus.ARCHIVED]: 'Archivée',
    }[status];
  }

  private errorLabel(code?: string): string {
    if (code === 'STUDY_NAME_ALREADY_EXISTS') {
      return 'Nom déjà utilisé';
    }

    if (code === 'STUDY_DATE_RANGE_INVALID') {
      return 'Les dates doivent être comprises entre le 01/01/1950 et aujourd’hui. La date de fin ne peut pas être antérieure à la date de début.';
    }

    return 'Création impossible';
  }

  private normalizePayload() {
    const value = this.form.getRawValue();
    return {
      ...value,
      startDate: this.toApiDate(value.startDate),
      endDate: this.toApiDate(value.endDate),
    };
  }

  private toApiDate(value: string): string | null {
    return value.length > 0 ? `${value}T12:00:00` : null;
  }

  private validateDates(): string {
    const { startDate, endDate } = this.form.getRawValue();

    if (!this.isDateInRange(startDate, this.minDate, this.maxDate)) {
      return 'La date de début doit être comprise entre le 01/01/1950 et aujourd’hui.';
    }

    if (
      endDate.length > 0 &&
      !this.isDateInRange(endDate, startDate || this.minDate, this.maxDate)
    ) {
      return 'La date de fin doit être comprise entre la date de début et aujourd’hui.';
    }

    return '';
  }

  private isDateInRange(value: string, min: string, max: string): boolean {
    return value.length === 0 || (value >= min && value <= max);
  }

  private todayInputValue(): string {
    const today = new Date();
    return [
      today.getFullYear(),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getDate().toString().padStart(2, '0'),
    ].join('-');
  }
}
