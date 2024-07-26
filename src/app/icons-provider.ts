import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  HomeOutline,
  DeleteOutline,
  MessageOutline,
  PictureOutline,
  ReloadOutline,
  RedoOutline,
  RocketOutline,
  CloseCircleOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  HomeOutline,
  FormOutline,
  DeleteOutline,
  MessageOutline,
  PictureOutline,
  ReloadOutline,
  RedoOutline,
  RocketOutline,
  CloseCircleOutline
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
