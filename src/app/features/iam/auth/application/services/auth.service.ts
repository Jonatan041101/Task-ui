import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../../shared/models/user.model';
import {
  applyActionCode,
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth';
import { environment } from '../../../../environments/environment';
import Cookies from 'universal-cookie';
import { Router } from '@angular/router';
export const accessToken = new Cookies('accessToken', { path: '/' });
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private router = inject(Router);
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  async handleSignInLink() {
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      try {
        const xd = applyActionCode(this.auth, window.location.href);
        console.log(xd, 'xd');
        if (isSignInWithEmailLink(this.auth, window.location.href)) {
          const email = localStorage.getItem('emailForSignIn');

          if (!email) {
            return null;
          }
          const result = await signInWithEmailLink(this.auth, email, window.location.href);

          const idToken = await result.user.getIdToken();

          accessToken.set('accessToken', idToken);
          return idToken;
        }
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  createUser(user: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }
  async login(signInDto: UserModel): Promise<Observable<any>> {
    const res = await this.http.post(`${this.apiUrl}auth`, signInDto);
    localStorage.setItem('emailForSignIn', signInDto.email);
    return res;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      throw error;
    }
  }
}
