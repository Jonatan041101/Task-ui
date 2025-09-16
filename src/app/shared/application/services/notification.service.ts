import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  showNotification(message: string, duration: number = 3000): void {
    const existingToast = document.querySelector('.app-notification-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'app-notification-toast';

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #000;
      color: #eab308;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
