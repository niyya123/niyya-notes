import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../shared/userInfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  standalone: true,
  imports:[
    CommonModule
  ]
})
export class UserInfoComponent implements OnInit {

  loading = true
  user:any

  constructor(private ussv : UserInfoService) { }

  async ngOnInit() {
    let req = await this.ussv.apiGetUserInfo();
    this.user = req
    this.loading = false;
    console.log('this.user: ', this.user);
  }
}
