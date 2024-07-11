import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserInfoService } from '../../shared/userInfo';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[
    NzLayoutModule,
    NzMenuModule,
    RouterOutlet,
    NzIconModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit {

  isCollapsed = false;
  currentUser = ''

  constructor(private ussv: UserInfoService) { }

  ngOnInit() {
    let user = this.ussv.getUser()
    this.currentUser = user.username
   }

  logout(){
    this.ussv.logout()
  }

}
