import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StandardInputComponent } from '../../../shared/components/standard-input/standard-input.component';
import { TaskForm } from '../application/interfaces/task-form.interface';
import { Task } from '../domain/task.domain';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StandardInputComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges {
  @Input() errorMessages: Record<string, Record<string, string>> = {};
  @Input() taskToEdit: Task | null = null;
  @Input() isEditMode = false;
  @Input() isSubmitting = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() taskSubmit = new EventEmitter<any>();

  taskForm: FormGroup<TaskForm>;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
      });
    } else if (changes['taskToEdit'] && !this.taskToEdit) {
      this.taskForm.reset();
    }
  }

  onClose() {
    this.closeModalEvent.emit();
    this.taskForm.reset();
  }

  onSubmit() {
    if (this.taskForm.valid && !this.isSubmitting) {
        
      const formData = {
        ...this.taskForm.value,
        uuid: this.isEditMode && this.taskToEdit ? this.taskToEdit.uuid : undefined,
      };
      this.taskSubmit.emit(formData);
    }
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.taskForm.get(controlName);
    if (control?.touched && control.invalid && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.errorMessages[controlName][errorKey];
    }
    return null;
  }
}
