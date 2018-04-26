import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'checkIfKeyboardDisabled',
  pure: true
})
export class CheckIfKeyboardDisabledPipe implements PipeTransform {
    console.count('pipe keyboarddisabled');
  transform(maxLength: number, valueLength: number): boolean {
    return maxLength > 0 && valueLength >= maxLength;

  }
}
