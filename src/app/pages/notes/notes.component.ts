import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotesService } from './notes.services';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AddEditNoteComponent } from '../../modals/notes/add-edit-note/add-edit-note.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { UserInfoService } from '../../shared/userInfo';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzSwitchModule,
    CommonModule,
    NzInputModule,
    FormsModule
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {

  constructor(
    private notesSv : NotesService,
    private modal : NzModalService,
    private noti : NzNotificationService,
    private ussv : UserInfoService
  ){}

  listNotes:any

  async ngOnInit(){
    await this.loadListNotes();
  }

  async loadListNotes(){
    this.listNotes = []
    let req = await this.notesSv.getNotes();
    this.listNotes = req;
    console.log('req: ', req);
  }

  convertNumberToDate(value:any){
    value = value.toString()

    // Extract year, month, and day from the input string
    const year = value.substr(0, 4);
    const month = value.substr(4, 2);
    const day = value.substr(6, 2);

    // Construct the formatted date string in DD/MM/YYYY format
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  openAddModal(){
    const modal = this.modal.create({
      nzTitle: 'Add New Note',
      nzContent: AddEditNoteComponent,
      nzWidth:900,
      nzCentered: true,
      nzFooter: null,
      nzData:{
        view:false,
        note_id: null
      }
    })
    modal.afterClose.subscribe((res:any)=>{
      if (res?.message == "Tạo thành công") {
        this.loadListNotes();
      }
      if (res?.message == "Tạo thành công. Tạo lần nữa") {
        this.loadListNotes();
      }
    })
  }

  delete(id:any){
    this.modal.confirm({
      nzTitle:'Confirm delete',
      nzContent:'Are you sure you want to delete this note?',
      nzOnOk:async ()=>{
        let req = await this.notesSv.deleteNote(id);
        if(req.code == 200){
          this.noti.success('Success', 'Deleted Successfully');
          this.loadListNotes();
        }
      }
    })
  }

  update(id:any){
    const modal = this.modal.create({
      nzTitle: 'Edit Note',
      nzContent: AddEditNoteComponent,
      nzWidth:900,
      nzCentered: true,
      nzFooter: null,
      nzData:{
        view:false,
        note_id: id
      }
    })
    modal.afterClose.subscribe((res:any)=>{
      if (res?.message == "Cập nhật thành công") {
        this.loadListNotes();
      }
    })
  }

  checkPermission(author:any){
    let user = this.ussv.getUser()
    if(author !== user.username){
      return false
    }else return true
  }
}
