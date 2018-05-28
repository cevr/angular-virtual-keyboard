import { Pipe, PipeTransform } from '@angular/core';
import { isSpacer, isNeverDisabled } from '../helpers/keys';

@Pipe({
  name: 'checkIfKeyDisabled',
  pure: true
})
export class CheckIfKeyDisabledPipe implements PipeTransform {
  transform(key: string, isDisabled: boolean): boolean {
    if (isSpacer(key)) {
      return true;
    } else if (isDisabled && isNeverDisabled(key)) {
      return false;
    } else {
      return isDisabled;
    }
  }
}
