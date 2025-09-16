import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { environment } from '../../environments/environment.development';

export class FirebaseClient {
  private static instance: FirebaseClient;
  private app: FirebaseApp | null = null;
  private firestore: Firestore | null = null;

  private constructor() {}

  public static getInstance(): FirebaseClient {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public initialize(): FirebaseApp {
    if (!this.app) {
      // Verificar si ya existe una app
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        this.app = initializeApp({
          apiKey: environment.firebase.apiKey,
          authDomain: environment.firebase.authDomain,
          projectId: environment.firebase.projectId,
          storageBucket: environment.firebase.storageBucket,
          messagingSenderId: environment.firebase.messagingSenderId,
          appId: environment.firebase.appId,
          measurementId: environment.firebase.measurementId,
        });
      }
    }
    return this.app;
  }

  public getApp(): FirebaseApp {
    if (!this.app) {
      throw new Error('Firebase Client not initialized. Call initialize() first.');
    }
    return this.app;
  }

  public getFirestore(): Firestore {
    if (!this.firestore) {
      this.firestore = getFirestore(this.getApp());
    }
    return this.firestore;
  }
}
