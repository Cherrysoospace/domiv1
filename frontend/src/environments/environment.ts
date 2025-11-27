// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { GEMINI_KEY } from '../../src/environments/secretkey';
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  geminiApiKey: 'GEMINI_KEY',
  geminiUrl: 'https://generative.googleapis.com/v1beta2/models/gemini-1.0:generateText',
  mockServerUrl: 'https://e60a8f75-7355-478d-8f96-c7229f8574b6.mock.pstmn.io',
  // Clave de API de Google Maps (reemplaza con tu propia clave)
  googleMapsApiKey: 'AIzaSyAdEAb3urB1jwxUlyDzWcEh10EOPhifdhw',
  // Configuración de Firebase para autenticación OAuth2
  firebase: {
    apiKey: "AIzaSyAdEAb3urB1jwxUlyDzWcEh10EOPhifdhw",
    authDomain: "react-proyect-fernando.firebaseapp.com",
    projectId: "react-proyect-fernando",
    storageBucket: "react-proyect-fernando.firebasestorage.app",
    messagingSenderId: "387736521137",
    appId: "1:387736521137:web:dd507ed1fc9a14678e1590",
    measurementId: "G-VBLNFRH7M4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
