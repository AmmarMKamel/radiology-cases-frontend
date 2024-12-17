import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const urlRegex =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+|localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/[\w- ./?%&=]*)?(#[\w-]*)?$/;

  const value = control.value;

  // Allow empty value (other validators should handle 'required')
  if (!value) {
    return null;
  }

  // Validate against the regex
  if (!urlRegex.test(value)) {
    return { urlInvalid: true };
  }

  return null;
}
