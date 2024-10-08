import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { vi_VN, provideNzI18n, en_GB } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptorFunction } from './shared/interceptors/checkToken';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.services';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


const config: SocketIoConfig = { url: 'wss://niyya-notes-api.onrender.com', options: {} };

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
    ), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([TokenInterceptorFunction])),
  ],
};
