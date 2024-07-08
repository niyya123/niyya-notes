import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../shared/userInfo';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  user:any

  constructor(private ussv : UserInfoService) { }

  async ngOnInit() {
    let req = await this.ussv.getUserInfo();
    this.user = req
    console.log('this.user: ', this.user);
  }
}
