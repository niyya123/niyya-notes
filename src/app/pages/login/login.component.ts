import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserInfoService } from '../../shared/userInfo';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private lgsv: LoginService,
    private ussv: UserInfoService,
    private noti: NzNotificationService
  ) {}
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  async submitForm() {
    // this.route.navigate(['/home']);
    try {
      let data = {
        email: this.form.value.email,
        password: this.form.value.password,
      };
      let req = await this.lgsv.login(data);
      if (req) {
        if (req.token) {
          this.ussv.setToken(req.token);
          this.ussv.setUserId(req.id);
          this.ussv.setUser(req);
          this.route.navigate(['/home']);
        }
        this.lgsv.firebaseLogin(this.form.value.email,this.form.value.password)
      }
    } catch (error) {
      console.log('error: ', error);
      if (error.error.msg == 'Invalid credentials') {
        this.noti.error('Error', 'Wrong credentials');
      } else {
        this.noti.error('Error', "Service's unavailable now");
      }
    }
  }
}
