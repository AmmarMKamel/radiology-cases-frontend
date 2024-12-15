import { AbstractControl, ValidationErrors } from '@angular/forms';

export function radiopaediaValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  if (!control.value.toLowerCase().includes('radiopaedia')) {
    return { radiopaediaMissing: true };
  }

  return null;
}
