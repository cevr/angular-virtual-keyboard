import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { VirtualKeyboardComponent } from '../components/virtual-keyboard/virtual-keyboard.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Directive({
  selector: '[virtual-keyboard]'
})
export class VirtualKeyboardDirective {
  public constructor(private element: ElementRef, private dialog: MatDialog) {}

  @Input('virtual-keyboard-layout') layout: string = 'default';
  @Input('virtual-keyboard-start-uppercased') startUppercased = false;
  @Input('virtual-keyboard-input-type') inputType;
  @Input('virtual-keyboard-placeholder') placeholder: string;
  @Input('virtual-keyboard-hide-caret') shouldHideCaret = false;
  @Output() dispatch = new EventEmitter();

  private opened = false;
  private focus = true;
  private dialogRef: MatDialogRef<VirtualKeyboardComponent>;

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

  @HostListener('mousedown')
  onClick() {
    this.openKeyboard();
  }

  private openKeyboard() {
    const data = {
      inputElement: this.element,
      layout: this.layout,
      maxLength:
        this.element.nativeElement.localName === 'app-button'
          ? 4
          : this.element.nativeElement.maxLength,
      layoutType: this.layout,
      shouldHideCaret: this.shouldHideCaret,
      directiveRef: this,
      startUppercased: this.startUppercased,
      inputType: this.inputType,
      placeholder: this.placeholder
    };

    if (!this.opened && this.focus) {
      this.opened = true;
      this.dialogRef = this.dialog.open(VirtualKeyboardComponent, {
        disableClose: true,
        data
      });
      this.dialogRef.afterClosed().subscribe(() => {
        setTimeout(() => {
          this.opened = false;
        }, 0);
      });
    }
  }
}
