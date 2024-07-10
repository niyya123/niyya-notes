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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

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
    FormsModule,
    NzPaginationModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzDatePickerModule
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

  filter={
    title: '',
    isDone: 2,
    author: '',
    createdAt: null,
    endDate: null,
    text:''
  }


  listNotes:any
  total:any
  page = 1
  pageSize = 8
  pageSizeOption = [2,4,8]

  async ngOnInit(){
    await this.loadListNotes();
  }

  async loadListNotes(){
    this.listNotes = []
    let data = {
      page: this.page,
      pageSize: this.pageSize,
    }
    let req = await this.notesSv.getNotes(data);
    this.listNotes = req.todos;
    this.total = req.totalItems;
    console.log('req: ', req);
  }

  async searchListNotes(){
    this.listNotes = []
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      title: this.filter.title,
      isDone: this.filter.isDone == 2 ? null : this.filter.isDone == 1 ? true : false,
      author: this.filter.author,
      createdAt: this.filter.createdAt ? this.convertDateToNumber(this.filter.createdAt) : null,
      endDate: this.filter.endDate ? this.convertDateToNumber(this.filter.endDate) : null,
      text:this.filter.text
    }
    let req = await this.notesSv.searchNotes(data);
    this.listNotes = req.todos;
    this.total = req.totalItems;
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

  changeStatus(id:any, newStatus:any){
    this.modal.confirm({
      nzTitle:'Change Status',
      nzContent:'Are you sure you want to change status of this note?',
      nzOnOk:async ()=>{
        let data = {
          id:id,
          isDone : newStatus
        }
        console.log('data: ', data);
        let req = await this.notesSv.updateStatusNotes(data)
        if(req.code == 200){
          this.noti.success('Success', 'Status changed successfully');
          this.loadListNotes();
        }else{
          this.noti.error('Failed', 'Status update failed');
          this.loadListNotes();
        }
      },
      nzOnCancel:async ()=>{
        let a = this.listNotes.find((note:any)=> note._id == id)
        a.isDone = !a.isDone
      }
    })
  }

  changePageIndex($event:any){
    this.page = $event;
    this.loadListNotes();
  }

  changePageSize($event:any){
    this.pageSize = $event
    this.loadListNotes();
  }

  resetFilter(){
    this.filter={
      title: '',
      isDone: 2,
      author: '',
      createdAt: '',
      endDate: '',
      text:''
    }
    this.loadListNotes();
  }

  search(){
    this.searchListNotes()
  }
}
