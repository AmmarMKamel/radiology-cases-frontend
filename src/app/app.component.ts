import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menubar, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Radiology Cases';
  items: MenuItem[] = [
    { label: 'All Cases', routerLink: 'cases' },
    { label: 'Add Case', routerLink: 'cases/add' },
  ];
  showMenubar = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showMenubar.set(!event.url.startsWith('/cases/'));
      });
  }
}
