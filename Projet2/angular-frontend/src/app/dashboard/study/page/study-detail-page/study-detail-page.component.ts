import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Study, StudyStatus } from '../../model';
import { StudyService } from '../../study.service';

@Component({
  selector: 'app-study-detail-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './study-detail-page.component.html',
  styleUrl: './study-detail-page.component.scss',
})
export class StudyDetailPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly minDate = '1950-01-01';
  readonly maxDate = this.todayInputValue();
  readonly study = signal<Study | null>(null);
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: StudyService,
  ) {}

  ngOnInit(): void {
    this.loadStudy();
  }

  delete(): void {
    const currentStudy = this.study();
    if (!currentStudy) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.service.delete(currentStudy.study_id).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard/studies'),
      error: (error) => {
        this.errorMessage.set(error.error?.code ?? 'Suppression impossible');
        this.loading.set(false);
      },
    });
  }

  loadStudy(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Identifiant manquant');
      return;
    }

    this.loading.set(true);
    this.service.detail(id).subscribe({
      next: (response) => {
        this.updateForm(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.code ?? 'Chargement impossible');
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

  codeLabel(code: string): string {
    return /^\d+$/.test(code) ? code.padStart(4, '0') : code;
  }

  update(): void {
    const currentStudy = this.study();
    if (!currentStudy) {
      return;
    }

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
    const value = this.form.getRawValue();
    this.service
      .update({
        study_id: currentStudy.study_id,
        ...value,
        startDate: this.toApiDate(value.startDate),
        endDate: this.toApiDate(value.endDate),
      })
      .subscribe({
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

  private errorLabel(code?: string): string {
    if (code === 'STUDY_NAME_ALREADY_EXISTS') {
      return 'Nom déjà utilisé';
    }

    if (code === 'STUDY_DATE_RANGE_INVALID') {
      return 'Les dates doivent être comprises entre le 01/01/1950 et aujourd’hui. La date de fin ne peut pas être antérieure à la date de début.';
    }

    return 'Modification impossible';
  }

  private toApiDate(value: string): string | null {
    return value.length > 0 ? `${value}T12:00:00` : null;
  }

  private toInputDate(value: string | null): string {
    const date = this.toLocalDate(value);
    if (!date) {
      return '';
    }

    return [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
    ].join('-');
  }

  private toLocalDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
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

  private updateForm(study: Study): void {
    this.study.set(study);
    this.form.patchValue({
      name: study.name,
      description: study.description ?? '',
      startDate: this.toInputDate(study.startDate),
      endDate: this.toInputDate(study.endDate),
      status: study.status,
    });
  }
}
