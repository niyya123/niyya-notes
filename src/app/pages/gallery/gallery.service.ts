import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) { }
  getImages(params: { page?: number; pageSize?: number; author?: string }): Promise<any> {
    let reqParams = new HttpParams();
    if (params.page && params.pageSize) {
      reqParams = reqParams.append('page', params.page.toString());
      reqParams = reqParams.append('pageSize', params.pageSize.toString());
      reqParams = reqParams.append('author', params.author.toString());
    }
    return this.http.get<any>(`${apiUrl}/gallery`, { params: reqParams }).toPromise()
  }

  deleteImage(id:any): Promise<any>{
    return this.http.delete<any>(`${apiUrl}/gallery/${id}`).toPromise()
}
}
