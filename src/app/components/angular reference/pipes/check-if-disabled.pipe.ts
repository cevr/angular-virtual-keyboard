import { Pipe, PipeTransform } from '@angular/core';
import { isSpacer, isNeverDisabled } from '../helpers/keys';
import memo from 'memo-decorator';

@Pipe({
  name: 'checkIfDisabled',
  pure: true
})
export class CheckIfDisabledPipe implements PipeTransform {
  // @memo()
  transform(key: string, isDisabled: boolean): boolean {
    console.count('pipe isDisabled');
    if (isSpacer(key)) {
      return true;
    } else if (isDisabled && isNeverDisabled(key)) {
      return false;
    } else {
      return isDisabled;
    }
  }
}
