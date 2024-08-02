import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../shared/userInfo';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AvatarChangeComponent } from '../../modals/user-info/change-avatar/avatar-change/avatar-change.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ]
})
export class UserInfoComponent implements OnInit {

  loading = true
  user:any

  constructor(private ussv : UserInfoService,
    private modal: NzModalService) { }

  async ngOnInit() {
    this.getUserFullInfo()
  }

  async getUserFullInfo(){
    let req = await this.ussv.apiGetUserInfo();
    this.user = req
    this.loading = false;
    console.log('this.user: ', this.user);
  }
  changeAvatar(){
    const modal = this.modal.create({
      nzTitle: 'Choose avatar',
      nzContent: AvatarChangeComponent,
      nzWidth:900,
      nzCentered: true,
      nzFooter: null,
      nzData:{
        view:false,
        user_id: this.user._id
      }
    })
    modal.afterClose.subscribe((res:any)=>{
      if (res?.message == "Đổi thành công") {
        this.getUserFullInfo();
      }
    })
  }
}
