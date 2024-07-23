import { NgxMasonryModule } from 'ngx-masonry';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GalleryService } from './gallery.service';
import { UserInfoService } from '../../shared/userInfo';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzImageModule } from 'ng-zorro-antd/image';
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    NgxMasonryModule,
    FormsModule,
    NzPaginationModule,
    NzIconModule,
    NzButtonModule,
    NzEmptyModule,
    NzModalModule,
    NzImageModule
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  constructor(
    private glsv : GalleryService,
    private ussv : UserInfoService,
    private modal : NzModalService,
    private noti : NzNotificationService
  ){}

  listImages : any
  deleteLoading : boolean = false

  total:any
  page = 1
  pageSize = 20
  pageSizeOption = [5,10,15,20]

  column = 5

  get rows(): number {
    return Math.ceil(this.pageSize / this.column);
  }

  async ngOnInit(){
    await this.loadImages();
  }

  async loadImages(){
    let user = this.ussv.getUser()
    this.listImages = []
    let data = {
      page: this.page,
      pageSize: this.pageSize,
      author : user.username
    }
    let req = await this.glsv.getImages(data);
    this.listImages = req.images;
    this.total = req.totalItems;
    console.log('req: ', req);
  }

  changePageIndex($event:any){
    this.page = $event;
    this.loadImages();
  }

  changePageSize($event:any){
    this.pageSize = $event
    this.loadImages();
  }

  deleteImage(id: string): void {
    this.modal.confirm({
      nzTitle: 'Delete',
      nzContent: 'Do you want to delete this image',
      nzCentered: true,
      nzOnOk:async ()=>{
        try {
          this.deleteLoading = true
          let req = await this.glsv.deleteImage(id)
          if(req.code == 200){
            this.noti.success('Success','Delete image successfully')
            this.deleteLoading = false
            await this.loadImages();
          }
        } catch (error) {
          this.noti.error('Error','Delete image unsuccessfully')
          this.deleteLoading = false
        }
      }
    })
  }
}
