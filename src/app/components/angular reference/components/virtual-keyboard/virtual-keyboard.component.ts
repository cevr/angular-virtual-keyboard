import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import memo from 'memo-decorator';

import { KeyboardLayout, specialKeys } from '../../models/layouts';
import { keyboardCapsLockLayout } from '../../helpers/keys';
import { VirtualKeyboardService } from '../../services/virtual-keyboard.service';
import { KeyPressInterface } from '../../interfaces/key-press.interface';

@Component({
  selector: 'virtual-keyboard',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.css']
})
export class VirtualKeyboardComponent implements OnInit, OnDestroy {
  @ViewChild('keyboardInput') keyboardInput: ElementRef;
  @Output() submitHandler = new EventEmitter();

  public inputElement: ElementRef;
  public layout: KeyboardLayout;
  public placeholder: string;
  public disabled: boolean;
  public maxLength: number | string;
  public keyboardShouldRender: boolean;
  public directiveRef;
  public startUppercased: boolean;
  public subscriptions: any[];
  public shift = false;

  private caretPosition: number;

  /**
   * Helper method to set cursor in input to correct place.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement}  input
   * @param {number}                                start
   * @param {number}                                end
   */
  private static setSelectionRange(
    input: any,
    start: number,
    end: number
  ): void {
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

  /**
   * Constructor of the class.
   *
   * @param {matDialogRef<VirtualKeyboardComponent>} dialogRef
   * @param {VirtualKeyboardService}                virtualKeyboardService
   */
  public constructor(
    public dialogRef: MatDialogRef<VirtualKeyboardComponent>,
    private virtualKeyboardService: VirtualKeyboardService,
    private changeDetection: ChangeDetectorRef
  ) {}

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
    this.keyboardInput.nativeElement.value = this.inputElement.nativeElement.value;

    this.caretPosition = this.keyboardInput.nativeElement.value.length;

    // This is a workaround to ensure that the keyboard input is focused on every render
    setTimeout(() => {
      this.keyboardInput.nativeElement.focus();
    }, 0);

    this.virtualKeyboardService.shift$.subscribe((shift: boolean) => {
      this.shift = shift;
    });

    this.virtualKeyboardService.capsLock$.subscribe((capsLock: boolean) => {
      this.shift = capsLock;
    });

    this.virtualKeyboardService.caretPosition$.subscribe(
      (caretPosition: number) => {
        this.caretPosition = caretPosition;

        setTimeout(() => {
          VirtualKeyboardComponent.setSelectionRange(
            this.keyboardInput.nativeElement,
            caretPosition,
            caretPosition
          );
        }, 0);
      }
    );

    if (this.startUppercased) {
      this.virtualKeyboardService.toggleShift();
    }

    if (this.keyboardInput.nativeElement.value.length) {
      this.virtualKeyboardService.setCaretPosition(
        this.keyboardInput.nativeElement.value.length
      );
    }

    this.maxLength = !!this.inputElement.nativeElement.maxLength
      ? this.inputElement.nativeElement.maxLength
      : 80;


  }

  /**
   * On destroy life cycle hook, in this we want to reset virtual keyboard service states on following:
   *  - Shift
   *  - CapsLock
   */
  public ngOnDestroy(): void {
    this.virtualKeyboardService.reset();
  }

  /**
   * Method to close virtual keyboard dialog
   */
  public close(): void {
    this.caretPosition = this.keyboardInput.nativeElement.value.length;
    this.dialogRef.close();
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
        this.virtualKeyboardService.toggleShift();
      }
    }


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
        this.close();
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
            this.virtualKeyboardService.setCaretPosition(
              this.caretPosition - 1
            );
          }
        } else {
          this.keyboardInput.nativeElement.value = currentValue.substring(
            0,
            currentValue.length - 1
          );
        }
        if (this.startUppercased && this.keyboardInput.nativeElement.value.length === 0) {
          this.virtualKeyboardService.toggleShift();
        }
        // Set focus to keyboard input
        this.keyboardInput.nativeElement.focus();
        break;
      case 'CapsLock':
        this.virtualKeyboardService.toggleCapsLock();
        break;
      case 'Shift':
        this.virtualKeyboardService.toggleShift();
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
        if (
          this.caretPosition < this.keyboardInput.nativeElement.value.length
        ) {
          this.virtualKeyboardService.setCaretPosition(this.caretPosition + 1);
        }
        break;

      case 'Delete':
        if (!this.keyboardInput.nativeElement.value) {
          return;
        }
        this.keyboardInput.nativeElement.value = '';
        if (this.startUppercased) {
          this.virtualKeyboardService.toggleShift();
        }
        break;
    }
  }

  public onSubmit() {
    // this.directiveRef.dispatch.emit({value: this.keyboardInput.nativeElement.value})
    this.inputElement.nativeElement.value = this.keyboardInput.nativeElement.value;
    this.close();
  }


}
