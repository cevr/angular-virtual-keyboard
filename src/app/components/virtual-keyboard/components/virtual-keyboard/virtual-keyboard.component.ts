import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

import { KeyboardLayout } from '../../models/layouts';
import { VirtualKeyboardService } from '../../services/virtual-keyboard.service';
import { KeyPressInterface } from '../../interfaces/key-press.interface';
import { AppContextService } from 'modules/web-core/services/context/app-context.service';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'virtual-keyboard',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
  providers: [AppContextService]
})
export class VirtualKeyboardComponent implements OnInit, OnDestroy {
  @ViewChild('keyboardInput') keyboardInput: ElementRef;

  public inputElement: ElementRef;
  public layout: KeyboardLayout;
  public layoutType = 'default';
  public placeholder: string;
  public disabled: boolean;
  public maxLength: number | string;
  public keyboardShouldRender = this.appContext.isEdge();
  public directiveRef;
  public startUppercased: boolean;
  public subscriptions: any[];
  public shift = false;
  public shouldHideCaret = false;
  public inputType;
  public errorMessage: string;

  private caretPosition: number;
  private onDestroy$ = new Subject<any>();

  /**
   * Helper method to set cursor in input to correct place.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement}  input
   * @param {number}                                start
   * @param {number}                                end
   */
  private static setSelectionRange(input: any, start: number, end: number): void {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(start, end);
    } else if (input.createTextRange) {
      const range = input.createTextRange();

      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<VirtualKeyboardComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private virtualKeyboardService: VirtualKeyboardService,
    private appContext: AppContextService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.inputElement = data.inputElement;
    this.inputType = this.inputElement.nativeElement.type
      ? this.inputElement.nativeElement.type
      : data.inputType;
    this.placeholder = this.inputElement.nativeElement.placeholder
      ? this.inputElement.nativeElement.placeholder
      : data.placeholder;
    this.layoutType = data.layoutType;
    this.shouldHideCaret = data.shouldHideCaret;
    this.directiveRef = data.directiveRef;
    this.layout = virtualKeyboardService.getLayout(data.layout);
    this.startUppercased = this.layoutType !== 'numeric' ? data.startUppercased : false;
    this.maxLength = data.maxLength;
  }
  /**
   * On init life cycle hook, this will do following:
   *  1) Set focus to virtual keyboard input field
   *  2) Subscribe to following
   *    2.1) Shift key, this is needed in keyboard event dispatches
   *    2.2) CapsLock key, this will change keyboard layout
   *    2.3) Caret position in virtual keyboard input
   *  3) Reset of possible previously tracked caret position
   */
  public ngOnInit(): void {
    if (this.inputElement.nativeElement.value) {
      this.keyboardInput.nativeElement.value = this.inputElement.nativeElement.value;
    } else {
      this.keyboardInput.nativeElement.value = '';
    }

    // This is a workaround to ensure that the keyboard input is focused on every render
    // by placing at the bottom of call queue
    setTimeout(() => {
      this.keyboardInput.nativeElement.focus();
    }, 0);

    this.virtualKeyboardService.caretPosition$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((caretPosition: number) => {
        this.caretPosition = caretPosition;

        setTimeout(() => {
          VirtualKeyboardComponent.setSelectionRange(
            this.keyboardInput.nativeElement,
            caretPosition,
            caretPosition
          );
        }, 0);
      });

    this.virtualKeyboardService.messageForm$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(errorMessage => {
        this.errorMessage = errorMessage;
        // work around to prevent error
        if (!this.changeDetector['destroyed']) {
          this.changeDetector.detectChanges();
        }
      });

    if (this.inputElement.nativeElement.value) {
      this.virtualKeyboardService.setCaretPosition(
        this.inputElement.nativeElement.value.length
      );
    }

    if (this.startUppercased) {
      this.shift = true;
    }
  }

  /**
   * On destroy life cycle hook, in this we:
   * - reset virtual keyboard shift state
   * - complete the subscriptions
   */
  public ngOnDestroy(): void {
    this.shift = this.startUppercased;
    this.onDestroy$.next();
  }

  /**
   * Method to close virtual keyboard dialog
   */
  @HostListener('document:keydown.escape')
  private close(): void {
    this.dialogRef.close();
  }

  @HostListener('document:keydown.enter')
  private onSubmit(): void {
    this.directiveRef.dispatch.emit({
      value: this.keyboardInput.nativeElement.value
    });
    this.inputElement.nativeElement.value = this.keyboardInput.nativeElement.value;
    // workaround to place this in the bottom of call stack
    // this ensures the dialog does not close if there is an error
    setTimeout(() => {
      if (!this.errorMessage) {
        this.close();
      }
    }, 0);
  }
  /**
   * Method to update caret position. This is called on click event in virtual keyboard input element.
   */
  public updateCaretPosition(): void {
    this.virtualKeyboardService.setCaretPosition(
      this.keyboardInput.nativeElement.selectionStart
    );
  }

  /**
   * Method to handle actual "key" press from virtual keyboard.
   *  1) Key is "Special", process special key event
   *  2) Key is "Normal"
   *    - Append this key value to input
   *    - Dispatch DOM events to input element
   *    - Toggle Shift key if it's pressed
   *
   * @param {KeyPressInterface} event
   */
  public keyPress(event: KeyPressInterface): void {
    if (event.special) {
      this.handleSpecialKey(event);
    } else {
      this.handleNormalKey(event.keyValue);

      // turn shift off after first normal keypress
      if (this.shift) {
        this.shift = !this.shift;
      }
    }
    this.errorMessage = '';
    this.keyboardInput.nativeElement.focus();
  }

  /**
   * Method to handle "normal" key press event, this will add specified character to input value.
   *
   * @param {string}  keyValue
   */
  private handleNormalKey(keyValue: string): void {
    let value = '';

    // We have caret position, so attach character to specified position
    if (!isNaN(this.caretPosition)) {
      value = [
        this.keyboardInput.nativeElement.value.slice(0, this.caretPosition),
        keyValue,
        this.keyboardInput.nativeElement.value.slice(this.caretPosition)
      ].join('');

      // Update caret position
      this.virtualKeyboardService.setCaretPosition(this.caretPosition + 1);
    } else {
      value = `${this.keyboardInput.nativeElement.value}${keyValue}`;
    }

    // And finally set new value to input
    this.keyboardInput.nativeElement.value = value;
    this.keyboardInput.nativeElement.focus();
  }

  /**
   * Method to handle "Special" key press events.
   *  1) Enter
   *  2) Escape, close virtual keyboard
   *  3) Backspace, remove last character from input value
   *  4) CapsLock, toggle current layout state
   *  6) Shift, toggle current layout state
   *  5) SpaceBar
   */
  private handleSpecialKey(event: KeyPressInterface): void {
    switch (event.keyValue) {
      case 'Enter':
        this.onSubmit();
        break;
      case 'Escape':
        this.close();
        break;
      case 'Backspace':
        const currentValue = this.keyboardInput.nativeElement.value;

        if (!currentValue) {
          return;
        }
        // We have a caret position, so we need to remove char from that position
        if (!isNaN(this.caretPosition)) {
          // And current position must > 0
          if (this.caretPosition > 0) {
            const start = currentValue.slice(0, this.caretPosition - 1);
            const end = currentValue.slice(this.caretPosition);

            this.keyboardInput.nativeElement.value = `${start}${end}`;

            // Update caret position
            this.virtualKeyboardService.setCaretPosition(this.caretPosition - 1);
          }
        } else {
          this.keyboardInput.nativeElement.value = currentValue.substring(
            0,
            currentValue.length - 1
          );
        }
        if (this.startUppercased && this.keyboardInput.nativeElement.value.length === 0) {
          this.shift = !this.shift;
        }
        // Set focus to keyboard input
        this.keyboardInput.nativeElement.focus();
        break;

      case 'Shift':
        this.shift = !this.shift;
        break;
      case 'SpaceBar':
        this.handleNormalKey(' ');
        break;
      case 'Left':
        if (this.caretPosition > 0) {
          this.virtualKeyboardService.setCaretPosition(this.caretPosition - 1);
        }
        break;
      case 'Right':
        if (this.caretPosition < this.keyboardInput.nativeElement.value.length) {
          this.virtualKeyboardService.setCaretPosition(this.caretPosition + 1);
        }
        break;

      case 'Delete':
        if (!this.keyboardInput.nativeElement.value) {
          return;
        }
        this.keyboardInput.nativeElement.value = '';
        this.virtualKeyboardService.setCaretPosition(0);
        if (this.startUppercased) {
          this.shift = !this.shift;
        }
        break;
    }
    this.keyboardInput.nativeElement.focus();
  }

  public trackByKeyValue(index: number, key) {
    return key.value;
  }
}
