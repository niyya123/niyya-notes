import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserInfoService } from '../../../shared/userInfo';
import { NotesService } from '../../../pages/notes/notes.services';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit-note',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzGridModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzSwitchModule,
    CommonModule
  ],
  templateUrl: './add-edit-note.component.html',
  styleUrl: './add-edit-note.component.scss'
})
export class AddEditNoteComponent implements OnInit {
  constructor(private fb : FormBuilder,
    private nzmodal : NzModalRef,
    private ussv : UserInfoService,
    private notesSv : NotesService,
    private noti : NzNotificationService){}
  readonly noteModalData = inject(NZ_MODAL_DATA);
  form!: FormGroup;

  id:any
  view:any

  ngOnInit(): void {
    this.form = this.fb.group({
      author: ['', Validators.required],
      text: ['', Validators.required],
      isDone: [false, Validators.required],
      createdAt: ['', Validators.required],
      endDate: ['', Validators.required],
      color: ['red', Validators.required],
      title: ['', Validators.required],
    })

    if (this.noteModalData.note_id) {

      this.id = this.noteModalData.note_id;

      this.view = this.noteModalData.view;

      this.getNoteInfo(this.id)
    }
  }

  async getNoteInfo(id:any){
    let req = await this.notesSv.getOneNote(id)
    this.form.patchValue({
      author: req.author,
      text: req.text,
      isDone: req.isDone,
      createdAt: this.convertNumberToDateObject(req.createdAt),
      endDate: this.convertNumberToDateObject(req.endDate),
      color: req.color,
      title: req.title,
    })
    console.log('req: ', req);
  }

  cancel(){
    this.nzmodal.close()
  }
  async create(){
    let user = this.ussv.getUser()
    let data = {

      author: user?.username,
      text: this.form.value.text,
      isDone: false,
      createdAt: this.convertDateToNumber(new Date()),
      endDate: this.convertDateToNumber(this.form.value.endDate),
      color: this.form.value.color,
      title: this.form.value.title,
    }
    console.log('data: ', data);
    let req = await this.notesSv.createNotes(data);
    console.log('req: ', req);
    if(req?.code == 200){
      this.noti.success('Success','User created successfully')
      this.nzmodal.close({
        message:'Tạo thành công'
      })
    }
  }

  async update(){
    // debugger
    let user = this.ussv.getUser()
    console.log('this.form.value: ', this.form.value);
    let data = {
      id:this.id,
      author: user?.username,
      text: this.form.value.text,
      isDone: this.form.value.isDone,
      createdAt: this.convertDateToNumber(this.form.value.createdAt),
      endDate: this.convertDateToNumber(this.form.value.endDate),
      color: this.form.value.color,
      title: this.form.value.title,
    }
    console.log('data: ', data);
    let req = await this.notesSv.updateNotes(data);
    console.log('req: ', req);
    if(req?.code == 200){
      this.noti.success('Success','User updated successfully')
      this.nzmodal.close({
        message:'Cập nhật thành công'
      })
    }
  }

  convertDateToNumber(date:Date){
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString(); // Months are zero-based in JavaScript
    let day = date.getDate().toString();
  
    // Ensure month and day are two digits
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
  
    // Combine into YYYYMMDD format and convert to number
    const formattedDate = `${year}${month}${day}`;
    return parseInt(formattedDate, 10);
  }

  convertNumberToDateObject(value:any){
    const dateString = value.toString();

    // Extract year, month, and day from the string
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are zero-based in JavaScript
    const day = parseInt(dateString.substring(6, 8), 10);
  
    // Create a new Date object with the extracted values
    return new Date(year, month, day);
  }
}
