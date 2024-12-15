import { Component, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Validators
import { urlValidator } from '../validators/url.validator';
import { radiopaediaValidator } from '../validators/radiopaedia.validator';
import { CasesService } from '../cases.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-case',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddon,
    InputText,
    Button,
    Toast,
  ],
  templateUrl: './add-case.component.html',
  styleUrl: './add-case.component.scss',
  providers: [MessageService],
})
export class AddCaseComponent implements OnInit {
  addCaseForm: FormGroup = new FormGroup({});
  isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private casesService: CasesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initAddCaseForm();
  }

  initAddCaseForm(): void {
    this.addCaseForm = this.fb.group({
      url: ['', [Validators.required, urlValidator, radiopaediaValidator]],
    });
  }

  submitAddCaseForm(): void {
    this.isLoading.set(true);

    if (this.addCaseForm.invalid) {
      this.addCaseForm.markAllAsTouched();
      this.isLoading.set(false);
      return;
    }

    const url = this.addCaseForm.value.url;

    this.casesService.addCase(url).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The case was added successfully',
          life: 3000,
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'An error occurred while trying to add the case',
          life: 3000,
        });
      },
    });
  }
}
