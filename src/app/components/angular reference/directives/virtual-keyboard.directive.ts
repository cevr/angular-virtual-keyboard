import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import memo from 'memo-decorator';

import { VirtualKeyboardComponent } from '../components/virtual-keyboard/virtual-keyboard.component';
import {
  extendedKeyboard,
  KeyboardLayout,
  numericKeyboard
} from '../models/layouts';

@Directive({
  selector: 'input[virtual-keyboard]'
})
export class VirtualKeyboardDirective {
  private opened = false;
  private focus = true;

  @Input('virtual-keyboard-layout') layout: KeyboardLayout | string;
  @Input('virtual-keyboard-should-render') shouldRender = false;
  @Input('virtual-keyboard-start-uppercased') startUppercased = true;
  @Output() dispatch = new EventEmitter();

  @HostListener('window:blur')
  onWindowBlur() {
    this.focus = false;
  }

  @HostListener('window:focus')
  onWindowFocus() {
    setTimeout(() => {
      this.focus = true;
    }, 0);
  }

  @HostListener('focus')
  onFocus() {
    this.openKeyboard();
  }

  @HostListener('click')
  onClick() {
    this.openKeyboard();
  }

  /**
   * Constructor of the class.
   *
   * @param {ElementRef}  element
   * @param {MatDialog}    dialog
   */
  public constructor(private element: ElementRef, private dialog: MatDialog) {}

  /**
   * Method to open virtual keyboard
   */
  private openKeyboard() {
    if (!this.opened && this.focus) {
      this.opened = true;

      let dialogRef: MatDialogRef<VirtualKeyboardComponent>;

      dialogRef = this.dialog.open(VirtualKeyboardComponent);
      dialogRef.componentInstance.inputElement = this.element;
      dialogRef.componentInstance.layout = this.getLayout(this.layout);
      dialogRef.componentInstance.placeholder = this.element.nativeElement.placeholder;
      dialogRef.componentInstance.keyboardShouldRender = this.shouldRender;
      dialogRef.componentInstance.startUppercased = this.startUppercased;
      dialogRef.componentInstance.directiveRef = this;

      dialogRef.afterClosed().subscribe(() => {
        setTimeout(() => {
          this.opened = false;
        }, 0);
      });
    }
  }

  /**
   * Getter for used keyboard layout.
   *
   * @returns {KeyboardLayout}
   */
  @memo()
  private getLayout(layout): KeyboardLayout {
    switch (layout) {
      case 'numeric':
        return numericKeyboard;

      default:
        return extendedKeyboard;
    }
  }
}
