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

import { VirtualKeyboardDirective } from './directives/virtual-keyboard.directive';
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
import { VirtualKeyboardKeyComponent } from './components/virtual-keyboard-key/virtual-keyboard-key.component';
import { VirtualKeyboardService } from './services/virtual-keyboard.service';
import {
  VirtualKeyboardLayoutPipe,
  CheckIfKeyDisabledPipe,
  CheckIfKeyboardDisabledPipe
} from './pipes/index';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VirtualKeyboardDirective,
    VirtualKeyboardComponent,
    VirtualKeyboardKeyComponent,
    VirtualKeyboardLayoutPipe,
    CheckIfKeyDisabledPipe,
    CheckIfKeyboardDisabledPipe
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
    MatFormFieldModule,
    TranslateModule
  ],
  entryComponents: [VirtualKeyboardComponent],
  exports: [VirtualKeyboardDirective]
})
export class VirtualKeyboardModule {}
