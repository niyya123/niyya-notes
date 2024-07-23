import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class AddImagesService {

constructor(private http: HttpClient) { }
  uploadImages(file:any, author:any):Promise<any>{
    const formData = new FormData();
    formData.append('image', file);
    formData.append('author', author);
    return this.http.post<any>(`${apiUrl}/gallery/upload`,formData).toPromise()
  }
}
