import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { vi_VN, provideNzI18n, en_GB } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TokenInterceptorFunction } from './shared/interceptors/checkToken';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.services';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from './environments/firebase_config';

// const config: SocketIoConfig = {
//   url: 'wss://niyya-notes-api.onrender.com',
//   options: {},
// };

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {},
};

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(en_GB),
    importProvidersFrom(
      FormsModule,
      SocketIoModule.forRoot(config),
      NgxDaterangepickerMd.forRoot(),
      AngularFireModule.initializeApp(firebaseConfig), // Initialize Firebase
      AngularFireAuthModule, // Firebase Authentication
      AngularFireStorageModule, // Firebase Storage
      AngularFirestoreModule // Firestore
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([TokenInterceptorFunction])),
  ],
};
