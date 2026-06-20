import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Study, StudyStatus } from '../../model';
import { StudyService } from '../../study.service';

@Component({
  selector: 'app-study-list-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './study-list-page.component.html',
  styleUrl: './study-list-page.component.scss',
})
export class StudyListPageComponent implements OnInit {
  readonly studies = signal<Study[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor(private readonly service: StudyService) {}

  ngOnInit(): void {
    this.loadStudies();
  }

  dateLabel(value: string | null): string {
    const date = this.toLocalDate(value);
    if (!date) {
      return '-';
    }

    return [
      date.getDate().toString().padStart(2, '0'),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getFullYear(),
    ].join('/');
  }

  codeLabel(code: string): string {
    return /^\d+$/.test(code) ? code.padStart(4, '0') : code;
  }

  loadStudies(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (response) => {
        this.studies.set(response.data);
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

  private toLocalDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
