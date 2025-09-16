const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const environmentFile = `
export const environment = {
  production: false,
  apiBaseUrl: '${process.env.API_BASE_URL}',
  apiKey: '${process.env.FIREBASE_API_KEY}',
  authDomain: 'task-8ec52.firebaseapp.com',
  projectId: 'task-8ec52',
  storageBucket: 'task-8ec52.firebasestorage.app',
  messagingSenderId: '92551053936',
  appId: '1:92551053936:web:26086c6b4f8556003daab5',
  measurementId: 'G-CN346VNRHP',
};
`;

const environmentFilePath = path.join(__dirname, 'src/environments/environment.ts');
fs.writeFileSync(environmentFilePath, environmentFile);
console.log('Archivo de ambiente generado correctamente.');