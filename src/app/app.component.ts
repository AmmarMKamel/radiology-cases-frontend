import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
export class AppComponent {
  title = 'Radiology Cases';
  items: MenuItem[] = [
    { label: 'All Cases', routerLink: 'cases' },
    { label: 'Add Case', routerLink: 'cases/add' },
  ];
}
