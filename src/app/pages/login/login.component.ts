import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserInfoService } from '../../shared/userInfo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  constructor(private fb : FormBuilder,
    private route : Router,
    private lgsv : LoginService,
    private ussv : UserInfoService){

  }
  form!: FormGroup

  ngOnInit() {
    this.form = this.fb.group({
      username : [''],
      password : ['']
    })
  }

  async submitForm(){
    // this.route.navigate(['/home']);
    let data = {
      username : this.form.value.username,
      password : this.form.value.password
    }
    let req = await this.lgsv.login(data)
    if(req){
      if(req.token){
        this.ussv.setToken(req.token)
        this.ussv.setUserId(req.id)
        this.route.navigate(['/home']);
      }
    }
  }
}
