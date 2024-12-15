import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-case-card',
  templateUrl: './case-card.component.html',
  styleUrl: './case-card.component.scss',
  standalone: true,
  imports: [NgClass],
  providers: [],
})
export class CaseCardComponent {
  @Input({ required: true }) subCase: any;
  @Input() active: boolean = false;
  @Output() selectSubCase = new EventEmitter<string>();

  markAsActive(): void {
    this.selectSubCase.emit(this.subCase._id);
  }
}
