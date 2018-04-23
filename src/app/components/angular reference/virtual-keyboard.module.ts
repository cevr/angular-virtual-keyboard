import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NgVirtualKeyboardDirective } from './directives/virtual-keyboard.directive';
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
import { VirtualKeyboardKeyComponent } from './components/virtual-keyboard-key/virtual-keyboard-key.component';
import { VirtualKeyboardService } from './services/virtual-keyboard.service';

@NgModule({
  declarations: [
    NgVirtualKeyboardDirective,
    VirtualKeyboardComponent,
    VirtualKeyboardKeyComponent
  ],
  providers: [VirtualKeyboardService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  entryComponents: [VirtualKeyboardComponent],
  exports: [NgVirtualKeyboardDirective]
})
export class NgVirtualKeyboardModule {}
