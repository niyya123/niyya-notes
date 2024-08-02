import { Component, OnInit, inject } from '@angular/core';
import { AddImagesService } from '../../../gallery/add-images/add-images.service';
import { UserInfoService } from '../../../../shared/userInfo';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { AvatarChangeService } from './avatar-change.service';

@Component({
  selector: 'app-avatar-change',
  templateUrl: './avatar-change.component.html',
  styleUrls: ['./avatar-change.component.scss'],
  standalone:true,
  imports:[
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    CommonModule
  ]
})
export class AvatarChangeComponent implements OnInit {

  readonly userId = inject(NZ_MODAL_DATA);

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  isLoading = false

  constructor( private acsv : AvatarChangeService,
    private ussv : UserInfoService,
    private noti : NzNotificationService,
    private modalRef : NzModalRef
    ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

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
        let req = await this.acsv.changeAvatar(this.selectedFile, this.userId.user_id)
        if(req.code == 200){
          this.noti.success('Success','uploaded image successfully')
          this.selectedFile = null;
          this.imageUrl = null;
          this.isLoading = false
          this.modalRef.close({
            message:"Đổi thành công"
          }) // close modal with true value to notify parent component that image has been uploaded successfully
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
