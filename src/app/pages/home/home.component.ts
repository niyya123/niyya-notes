import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserInfoService } from '../../shared/userInfo';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../shared/dark-mode.services';

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
    RouterModule,
    NzSwitchModule,
    FormsModule
  ]
})
export class HomeComponent implements OnInit {
  darkMode : any
  isCollapsed = false;
  currentUser = ''

  constructor(private ussv: UserInfoService,
    private darkModeService: DarkModeService
  ) { }

  ngOnInit() {
    let user = this.ussv.getUser()
    this.currentUser = user.username
   }

  logout(){
    this.ussv.logout()
  }

  checkDarkMode($event:any){
    this.darkModeService.toggleDarkMode();
  }

}
