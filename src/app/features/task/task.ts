import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from './application/services/task.service';
import { ModalComponent } from './components/modal.component';
import { ICreateTaskDto } from './application/dto/create-task.dto.interface';
import { IUpdateTaskDto } from './application/dto/update-task.dto.interface';
import { ConfirmModalComponent } from './components/confirm-modal.component';
import { NotificationService } from '../../shared/application/services/notification.service';
import { Task } from './domain/task.domain';
import { AuthService } from '../iam/auth/application/services/auth.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  isModalOpen = false;
  isModalDeleteOpen = false;
  editingTask: Task | null = null;
  isSubmitting = false;
  deleteTaskUuid: string = '';
  username: any;
  isLoadingTasks: Record<string, boolean> = {};
  isSubmittingDelete = false;
  errorMessages: Record<string, Record<string, string>> = {
    title: {
      required: '',
      minlength: 'El título debe tener al menos 5 caracteres.',
    },
    description: {
      required: 'La descripción es obligatoria.',
      minlength: 'La descripción debe tener al menos 10 caracteres.',
    },
  };

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getAllTasks();
    const username = localStorage.getItem('emailForSignIn');
    this.username = username;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((t) => !t.isCompleted).length;
  }

  get completeTasksCount(): number {
    return this.tasks.filter((t) => t.isCompleted).length;
  }

  trackByTaskId(task: Task): string {
    return task.uuid;
  }

  private handleApiError(err: any): void {
    const errorMessage =
      err?.error?.details?.[0] ||
      'Ocurrió un error inesperado, por favor inténtelo de nuevo más tarde.';
    this.notificationService.showNotification(errorMessage);
  }

  // ============== TASK CRUD OPERATIONS ==============

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.setFilter('all');
        this.notificationService.showNotification('Tareas obtenidas exitosamente');
      },
      error: (err) => this.handleApiError(err),
    });
  }

  createTask(taskForm: ICreateTaskDto): void {
    if (!taskForm?.title?.trim()) return;
    this.isSubmitting = true;
    this.taskService.createTask(taskForm).subscribe({
      next: (response) => {
        this.tasks = [...this.tasks, response];
        this.closeModal();
        this.setFilter(this.currentFilter);
        this.notificationService.showNotification('Tarea agregada exitosamente');
      },
      error: (err) => this.handleApiError(err),
      complete: () => (this.isSubmitting = false),
    });
  }

  completeTask(taskUuid: string): void {
    this.isLoadingTasks[taskUuid] = true;
    const currentTask = this.tasks.find((task) => taskUuid === task.uuid);
    if (!currentTask)
      return this.notificationService.showNotification(
        'No se encontro la tarea para actualizarla.',
      );
    const isCompleted = !currentTask.isCompleted;
    this.taskService.updateTask({ isCompleted }, taskUuid).subscribe({
      next: () => {
        this.tasks = this.tasks.map((task) =>
          task.uuid === taskUuid ? { ...task, isCompleted } : task,
        );
        this.setFilter(this.currentFilter);
        this.notificationService.showNotification(
          isCompleted ? 'Tarea completada exitosamente' : 'Tarea puesta en pendiente nuevamente',
        );
      },
      error: (err) => {
        this.handleApiError(err);
      },
      complete: () => {
        this.isLoadingTasks[taskUuid] = false;
        this.isSubmitting = false;
      },
    });
  }

  updateTask(taskForm: IUpdateTaskDto): void {
    const uuid = taskForm?.uuid ?? '';
    this.taskService
      .updateTask({ description: taskForm.description, title: taskForm.title }, uuid)
      .subscribe({
        next: (response) => {
          this.tasks = this.tasks.map((task) =>
            task.uuid === uuid
              ? { ...task, description: taskForm.description ?? '', title: taskForm.title ?? '' }
              : task,
          );
          this.setFilter(this.currentFilter);
          this.closeModal();
          this.notificationService.showNotification('Tarea actualizada exitosamente');
        },
        error: (err) => this.handleApiError(err),
        complete: () => (this.isSubmitting = false),
      });
  }

  openModaldeleteTask(taskUuid: string): void {
    this.isModalDeleteOpen = true;
    this.deleteTaskUuid = taskUuid;
  }
  closeModalDelete() {
    this.isModalDeleteOpen = false;
    this.deleteTaskUuid = '';
  }
  handleDeleteTask(isConfirmed: boolean): void {
    if (isConfirmed && this.deleteTaskUuid) {
      this.isSubmittingDelete = true;
      this.taskService.deleteTask(this.deleteTaskUuid).subscribe({
        next: (response) => {
          this.tasks = this.tasks.filter((task) => this.deleteTaskUuid !== task.uuid);
          this.setFilter(this.currentFilter);
          this.notificationService.showNotification('🗑️ Tarea eliminada');
        },
        error: (err) => this.handleApiError(err),
        complete: () => {
          this.closeModalDelete();
          this.isSubmittingDelete = false;
        },
      });
    } else {
      this.closeModalDelete();
    }
  }

  // ============== MODAL OPERATIONS ==============

  openCreateModal(): void {
    this.editingTask = null;
    this.isModalOpen = true;
  }

  openEditModal(task: Task): void {
    this.editingTask = task;
    this.isModalOpen = true;
  }

  onModalSubmit(taskForm: IUpdateTaskDto): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    if (this.editingTask) {
      this.updateTask(taskForm);
    } else {
      this.createTask(taskForm as ICreateTaskDto);
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingTask = null;
  }

  // ============== FILTER OPERATIONS ==============

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.filterTasks();
  }

  filterTasks(): void {
    switch (this.currentFilter) {
      case 'completed':
        this.filteredTasks = this.tasks.filter((task) => task.isCompleted);
        break;
      case 'pending':
        this.filteredTasks = this.tasks.filter((task) => !task.isCompleted);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  logout() {
    this.authService.logout();
  }
}
