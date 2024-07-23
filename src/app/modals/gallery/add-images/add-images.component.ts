import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { AddImagesService } from './add-images.service';
import { UserInfoService } from '../../../shared/userInfo';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-add-images',
  standalone: true,
  imports: [
    CommonModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: './add-images.component.html',
  styleUrl: './add-images.component.scss'
})
export class AddImagesComponent {
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  isLoading = false

  constructor( private aisv : AddImagesService,
    private ussv : UserInfoService,
    private noti : NzNotificationService
    ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onUpload() {
    if (this.selectedFile) {
      let user = this.ussv.getUser()
      try {
        this.isLoading = true
        let req = await this.aisv.uploadImages(this.selectedFile, user.username)
        if(req.code == 200){
          this.noti.success('Success','uploaded image successfully')
          this.selectedFile = null;
          this.imageUrl = null;
          this.isLoading = false
        }
      } catch (error) {
        this.noti.error('Error',error.error.error)
        this.isLoading = false
      }

    } else {
      this.noti.error('Error','No file selected')
      this.isLoading = false
    }
  }
}
