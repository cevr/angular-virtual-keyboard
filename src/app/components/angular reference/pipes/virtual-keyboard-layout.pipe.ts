import { Pipe, PipeTransform } from '@angular/core';
import { isSpecial } from '../helpers/keys';
import { KeyboardLayout } from '../models/layouts';
import memo from 'memo-decorator';
@Pipe({
  name: 'getLayout',
  pure: true
})
export class VirtualKeyboardLayoutPipe implements PipeTransform {
  @memo()
  transform(layout: KeyboardLayout): KeyboardLayout {
    console.count('layout');

      return layout.map(row =>
        row.map(key => (isSpecial(key) ? key : key.toUpperCase())));
      }

}
