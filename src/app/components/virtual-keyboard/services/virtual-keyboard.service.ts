import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import memo from 'memo-decorator';

import { extendedKeyboard, KeyboardLayout, numericKeyboard } from '../models/layouts';

@Injectable()
export class VirtualKeyboardService {
  public caretPosition$: ReplaySubject<number> = new ReplaySubject(1);
  public messageForm$: Subject<any> = new Subject();
  /**
   * Setter for caret position value.
   *
   * @param {number}  position
   */
  public setCaretPosition(position: number) {
    this.caretPosition$.next(position);
  }

  /**
   * Updates the message displayed in the virtual keybaord
   * @param {string} form
   */
  public setErrorMessage(message: string) {
    this.messageForm$.next(message);
  }

  /**
   * Getter for used keyboard layout.
   *
   * @returns {KeyboardLayout}
   */
  @memo()
  public getLayout(layout): KeyboardLayout {
    switch (layout) {
      case 'numeric':
        return numericKeyboard.map(row => row.map(key => ({ value: key })));

      default:
        return extendedKeyboard.map(row => row.map(key => ({ value: key })));
    }
  }
}
