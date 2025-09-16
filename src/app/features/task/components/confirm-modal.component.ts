import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnChanges{
  @Input() isOpen = false;
  @Input() message = '¿Estás seguro de que quieres realizar esta acción?';
  @Input() isSubmittingDelete=false
  @Output() confirmed = new EventEmitter<boolean>();
 

  ngOnChanges(_changes: SimpleChanges): void {
    
  }

  onConfirm() {
    this.confirmed.emit(true);
  }

  onCancel() {
    this.confirmed.emit(false);
  }
}