import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkIfKeyboardDisabled',
  pure: true
})
export class CheckIfKeyboardDisabledPipe implements PipeTransform {
  transform(maxLength: number, valueLength: number): boolean {
    return maxLength > 0 && valueLength >= maxLength;
  }
}
