import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { TableModule, TablePageEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

// Validators
import { urlValidator } from '../validators/url.validator';
import { radiopaediaValidator } from '../validators/radiopaedia.validator';
import { Case, CasesService } from '../cases.service';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-add-case',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    InputGroup,
    InputGroupAddon,
    InputText,
    Button,
    Toast,
    TableModule,
    InputIcon,
    IconField,
    ReactiveFormsModule,
  ],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
  providers: [],
})
export class CasesComponent implements OnInit {
  addCaseForm: FormGroup = new FormGroup({});
  isLoading = signal<boolean>(false);
  cases = signal<Case[]>([]);
  totalCases = signal<number>(0);
  searchTerm = new FormControl('');
  currnetPage = signal<number>(1);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private casesService: CasesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCases();

    this.searchTerm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.currnetPage.set(1);
        this.getCases(this.currnetPage(), term?.trim());
      });
  }

  initAddCaseForm(): void {
    this.addCaseForm = this.fb.group({
      url: ['', [Validators.required, urlValidator, radiopaediaValidator]],
    });
  }

  getCases(page: number = 1, searchTerm: string = ''): void {
    this.casesService.getCases(page, searchTerm).subscribe({
      next: (response) => {
        this.cases.set(response.cases);
        this.totalCases.set(response.total);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch the cases',
          life: 3000,
        });
      },
    });
  }

  pageChange(event: TablePageEvent): void {
    this.currnetPage.set(event.first / event.rows + 1);
    this.getCases(this.currnetPage());
  }
}
