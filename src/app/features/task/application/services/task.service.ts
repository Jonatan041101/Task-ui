// api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable } from 'rxjs';
import { UserModel } from '../../../../shared/models/user.model';
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth';
import { environment } from '../../../../../environments/environment';
import Cookies from 'universal-cookie';
import { Router } from '@angular/router';
import { ICreateTaskDto } from '../dto/create-task.dto.interface';
import { IUpdateTaskDto } from '../dto/update-task.dto.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  getAllTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}task`, { withCredentials: true, credentials: 'include' });
  }

  createTask(createTaskDto: ICreateTaskDto): Observable<any> {
    return this.http.post(`${this.apiUrl}task`, createTaskDto, {
      withCredentials: true,
      credentials: 'include',
    });
  }

  updateTask(updateTaskDto: IUpdateTaskDto, taskUuid: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}task/${taskUuid}`, updateTaskDto, {
      withCredentials: true,
      credentials: 'include',
    });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}task/${id}`, {
      withCredentials: true,
      credentials: 'include',
    });
  }
}
