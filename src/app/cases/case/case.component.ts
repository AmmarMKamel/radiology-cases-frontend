import {
  Component,
  computed,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Case, CasesService } from '../cases.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { CaseCardComponent } from './case-card/case-card.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrl: './case.component.scss',
  standalone: true,
  imports: [NgClass, ToastModule, CaseCardComponent, NgxSliderModule],
  providers: [],
})
export class CaseComponent implements OnInit {
  case!: Case;
  selectedSubCase!: any;

  sliderValue = signal<number>(0);
  sliderOptions!: Options;
  isMouseOverImage: boolean = false;

  touchStartX = 0;
  touchEndX = 0;
  touchStartY = 0;
  touchEndY = 0;

  selectedImgSrcIndex: Signal<number> = computed(() => {
    return this.selectedSubCase.images.length - this.sliderValue();
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casesService: CasesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      if (!id) {
        this.router.navigate(['..']);
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to fetch the case',
          life: 3000,
        });
        return;
      }

      this.getCase(id);
    });
  }

  getCase(id: string): void {
    this.casesService.getCase(id).subscribe({
      next: (response) => {
        this.case = response.case;
      },
      error: () => {
        this.router.navigate(['..']);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch the case',
          life: 3000,
        });
      },
    });
  }

  selectSubCase(id: string): void {
    this.selectedSubCase = this.case.data.find(
      (subCase: any) => subCase._id === id
    );

    this.sliderOptions = {
      floor: 1,
      ceil: this.selectedSubCase.images.length,
      vertical: true,
      hideLimitLabels: true,
      hidePointerLabels: true,
    };
    this.sliderValue.set(this.selectedSubCase.images.length);
  }

  onMouseEnter() {
    this.isMouseOverImage = true;
  }

  onMouseLeave() {
    this.isMouseOverImage = false;
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    if (this.isMouseOverImage && this.selectedSubCase?.images) {
      const delta = Math.sign(event.deltaY); // -1 for down, 1 for up
      const imageCount = this.selectedSubCase.images.length;

      this.sliderValue.update((prevValue: number) => {
        return Math.max(1, Math.min(imageCount, prevValue - delta));
      });
      event.preventDefault();
    }
  }

  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   console.log('Here 1!');
  //   if (this.selectedSubCase?.images) {
  //     this.touchStartX = event.touches[0].clientX;
  //     this.touchStartY = event.touches[0].clientY;
  //   }
  // }

  // @HostListener('touchmove', ['$event'])
  // onTouchMove(event: TouchEvent) {
  //   console.log('Here 2!');
  //   if (this.selectedSubCase?.images) {
  //     this.touchEndX = event.touches[0].clientX;
  //     this.touchEndY = event.touches[0].clientY;
  //   }
  // }

  // @HostListener('touchend')
  // onTouchEnd() {
  //   console.log('Here 3!');
  //   if (this.selectedSubCase?.images) {
  //     const deltaX = this.touchEndX - this.touchStartX;
  //     const deltaY = this.touchEndY - this.touchStartY;

  //     // Detect swipe direction (horizontal swipe)
  //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //       const imageCount = this.selectedSubCase.images.length;

  //       if (deltaX > 30) {
  //         // Swipe right
  //         this.sliderValue.update((prevValue: number) =>
  //           Math.min(imageCount, prevValue + 1)
  //         );
  //       } else if (deltaX < -30) {
  //         // Swipe left
  //         this.sliderValue.update((prevValue: number) =>
  //           Math.max(1, prevValue - 1)
  //         );
  //       }
  //     }
  //   }

  //   // Reset touch coordinates
  //   this.touchStartX = 0;
  //   this.touchEndX = 0;
  //   this.touchStartY = 0;
  //   this.touchEndY = 0;
  // }

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY; // Record the initial Y position
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndY = event.touches[0].clientY; // Continuously track the current Y position
  }

  onTouchEnd(): void {
    const deltaY = this.touchEndY - this.touchStartY;

    if (Math.abs(deltaY) > 30 && this.selectedSubCase?.images) {
      const imageCount = this.selectedSubCase.images.length;

      if (deltaY > 0) {
        // Swipe down
        this.sliderValue.update((prevValue: number) =>
          Math.min(imageCount, prevValue + 1)
        );
      } else {
        // Swipe up
        this.sliderValue.update((prevValue: number) =>
          Math.max(1, prevValue - 1)
        );
      }
    }

    // Reset touch coordinates
    this.touchStartY = 0;
    this.touchEndY = 0;
  }
}
