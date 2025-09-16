import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StandardInputComponent } from '../../../shared/components/standard-input/standard-input.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './application/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    StandardInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  errorMessages = {
    email: {
      required: '',
      email: 'Email inválido',
    },
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      const idToken = await this.authService.handleSignInLink();

      if (idToken) {
        this.router.navigate(['/task']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const auth = await this.authService.login(this.loginForm.value);
      auth.subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
          } else {
            this.errorMessage = response.message;
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error en el servidor';
        },
      });
    }
  }
}
