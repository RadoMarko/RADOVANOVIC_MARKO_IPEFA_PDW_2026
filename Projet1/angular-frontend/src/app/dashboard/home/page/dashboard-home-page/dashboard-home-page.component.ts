import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../../../security/security.service';

@Component({
  selector: 'app-dashboard-home-page',
  imports: [CommonModule],
  templateUrl: './dashboard-home-page.component.html',
  styleUrl: './dashboard-home-page.component.scss',
})
export class DashboardHomePageComponent implements OnInit {
  loading = true;
  errorMessage = '';

  constructor(
    readonly service: SecurityService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.service.me().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.code ?? 'Session invalide';
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.loading = true;
    this.service.refresh().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.code ?? 'Refresh impossible';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.service.logout();
    void this.router.navigateByUrl('/');
  }
}
