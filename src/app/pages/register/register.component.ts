import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RegisterService } from './register.service';
import { UserInfoService } from '../../shared/userInfo';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private fb : FormBuilder,
    private rgsv : RegisterService,
    private ussv : UserInfoService,
    private route : Router,){

  }
  form!: FormGroup

  ngOnInit() {
    this.form = this.fb.group({
      email:[''],
      username : [''],
      password : ['']
    })
  }

  async submitForm(){
    let data = {
      email : this.form.get('email')?.value,
      username : this.form.get('username')?.value,
      password : this.form.get('password')?.value
    }

    let req = await this.rgsv.register(data)
    if(req){
      if(req.token){
        this.ussv.setToken(req.token)
        this.route.navigate(['/login']);
      }
    }
  }
}
