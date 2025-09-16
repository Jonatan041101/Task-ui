import { FormControl } from '@angular/forms';

export interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
}
