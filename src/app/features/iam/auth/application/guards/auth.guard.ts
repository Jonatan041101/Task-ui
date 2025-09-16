import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { accessToken } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const auth = getAuth();

  return new Observable<boolean>((subscriber) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          accessToken.set('accessToken', token);
        });
        subscriber.next(true);
      } else {
        router.navigate(['/']);
        subscriber.next(false);
      }
      subscriber.complete();
    });
  }).pipe(first());
};

export const noAuthGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const auth = getAuth();

  return new Observable<boolean>((subscriber) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.navigate(['/task']);
        subscriber.next(false);
      } else {
        subscriber.next(true);
      }
      subscriber.complete();
    });
  }).pipe(first());
};
