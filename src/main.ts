import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/config/app.config';
import { App } from './app/app';
import { FirebaseClient } from './app/config/firebase.config';

FirebaseClient.getInstance().initialize();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
