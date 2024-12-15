import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;

  const value = control.value;

  // If the control value is empty, no error (use other validators for required checks)
  if (!value) {
    return null;
  }

  // Check if the value matches the URL regex
  if (!urlRegex.test(value)) {
    return { urlInvalid: true };
  }

  return null;
}
