import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-standard-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standard-input.component.html',
  styleUrls: ['./standard-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StandardInputComponent),
      multi: true,
    },
  ],
})
export class StandardInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() disabled: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() errorMessages: Record<string, string> = {};
  @Output() valueChange = new EventEmitter<string>();
  value: any = '';
  isDisabled: boolean = false;

  private onChange = (_: any) => {};
  private onTouch = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.valueChange.emit(target.value);

    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouch();
  }

  getFieldError(): string | null {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return null;
    }

    const errors = this.control.errors;
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey === 'required') {
      return `${this.label} es requerido`;
    }
    return this.errorMessages[firstErrorKey] || 'Campo inválido';
  }

  hasError(): boolean {
    return this.control ? !!(this.control.invalid && this.control.touched) : false;
  }
}
